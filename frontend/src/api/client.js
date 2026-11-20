// The only file that talks to the backend.
// VITE_USE_MOCK=true  -> in-memory demo data (no AWS needed)
// VITE_USE_MOCK=false -> API Gateway + S3 presigned uploads
import { mockComplaints } from './mockData'
import { detectPriority } from './priority'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms))
const currentUser = () => JSON.parse(localStorage.getItem('campusfix_user') || 'null')

async function http(path, options = {}) {
  const user = currentUser()
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-student-id': user?.studentId ?? '',
      'x-user-role': user?.role ?? 'student',
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

// ---------- mock store ----------
let store = mockComplaints.map((c) => ({ ...c }))
const previews = {} // imageKey -> object URL

function mockTriage(id) {
  store = store.map((c) => {
    if (c.complaintId !== id) return c
    const priority = detectPriority(c.title, c.description, c.category)
    const critical = priority === 'Critical'
    const at = new Date().toISOString()
    return {
      ...c, priority, status: critical ? 'Processing' : 'Pending', updatedAt: at,
      history: [...c.history, {
        status: critical ? 'Processing' : 'Pending', at,
        note: `Priority set to ${priority}` + (critical ? ' and escalated automatically' : ''),
      }],
    }
  })
}

// ---------- public API ----------
export async function getComplaints({ studentId } = {}) {
  if (!USE_MOCK) return http(`/complaints${studentId ? `?studentId=${encodeURIComponent(studentId)}` : ''}`)
  await wait()
  const sorted = [...store].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return studentId ? sorted.filter((c) => c.studentId === studentId) : sorted
}

export async function getComplaint(id) {
  if (!USE_MOCK) return http(`/complaints/${id}`)
  await wait()
  const c = store.find((x) => x.complaintId === id)
  if (!c) throw new Error('Complaint not found')
  return { ...c, imageUrl: c.imageKey ? previews[c.imageKey] : undefined }
}

export async function uploadImage(file) {
  if (USE_MOCK) {
    await wait(400)
    const imageKey = `uploads/mock/${Date.now()}-${file.name}`
    previews[imageKey] = URL.createObjectURL(file)
    return imageKey
  }
  const { url, fields, imageKey } = await http('/upload-url', {
    method: 'POST', body: JSON.stringify({ contentType: file.type }),
  })
  const form = new FormData()
  Object.entries(fields).forEach(([k, v]) => form.append(k, v))
  form.append('file', file) // must be last
  const res = await fetch(url, { method: 'POST', body: form })
  if (!res.ok) throw new Error('Image upload failed')
  return imageKey
}

export async function submitComplaint({ title, description, category, imageKey }) {
  if (!USE_MOCK)
    return http('/complaints', { method: 'POST', body: JSON.stringify({ title, description, category, imageKey }) })
  await wait(500)
  const now = new Date().toISOString()
  const complaint = {
    complaintId: `CF-${Math.floor(2000 + Math.random() * 7000)}`,
    studentId: currentUser()?.studentId ?? 'stu-001',
    title, description, category, imageKey: imageKey ?? null,
    priority: null, status: 'Pending', createdAt: now, updatedAt: now,
    history: [{ status: 'Pending', at: now, note: 'Complaint submitted' }],
  }
  store = [complaint, ...store]
  setTimeout(() => mockTriage(complaint.complaintId), 2500) // simulates Step Functions
  return complaint
}

export async function updateComplaintStatus(id, status) {
  if (!USE_MOCK) return http(`/complaints/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
  await wait()
  const at = new Date().toISOString()
  store = store.map((c) => c.complaintId === id
    ? { ...c, status, updatedAt: at, history: [...c.history, { status, at, note: `Marked as ${status.toLowerCase()}` }] }
    : c)
  return store.find((c) => c.complaintId === id)
}
