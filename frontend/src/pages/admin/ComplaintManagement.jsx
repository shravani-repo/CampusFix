import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import { PriorityBadge } from '../../components/ui/Badges'
import { Spinner, ErrorState, EmptyState } from '../../components/ui/States'
import useFetch from '../../hooks/useFetch'
import { getComplaints, updateComplaintStatus } from '../../api/client'
import { fmtDate } from '../../lib/format'
import { STATUSES, PRIORITIES, CATEGORIES, STATUS_STYLES } from '../../constants'

const sel = 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100'

export default function ComplaintManagement() {
  const { data, setData, error, loading, reload } = useFetch(() => getComplaints(), [])
  const [f, setF] = useState({ q: '', status: '', priority: '', category: '' })
  const [busy, setBusy] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const shown = (data ?? []).filter((c) =>
    (!f.status || c.status === f.status) &&
    (!f.priority || c.priority === f.priority) &&
    (!f.category || c.category === f.category) &&
    `${c.title} ${c.complaintId} ${c.studentId}`.toLowerCase().includes(f.q.toLowerCase()))

  const changeStatus = async (id, status) => {
    setBusy(id); setSaveError(null)
    try {
      const u = await updateComplaintStatus(id, status)
      setData(data.map((c) => (c.complaintId === id ? { ...c, ...u } : c)))
    } catch (e) {
      setSaveError(e.message)
    } finally {
      setBusy(null)
    }
  }

  return (
    <>
      <PageHeader title="Complaint management" subtitle="Review, filter and update every complaint." />
      <div className="mb-4 flex flex-wrap gap-3">
        <label className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={f.q} onChange={set('q')} placeholder="Search title, ID, student" aria-label="Search complaints" className={`${sel} w-64 pl-9`} />
        </label>
        <select value={f.status} onChange={set('status')} className={sel} aria-label="Filter by status"><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <select value={f.priority} onChange={set('priority')} className={sel} aria-label="Filter by priority"><option value="">All priorities</option>{PRIORITIES.map((s) => <option key={s}>{s}</option>)}</select>
        <select value={f.category} onChange={set('category')} className={sel} aria-label="Filter by category"><option value="">All categories</option>{CATEGORIES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      {saveError && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{saveError}</p>}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        {loading && <Spinner />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {data && (shown.length ? (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-5 py-3">Issue</th><th className="px-3 py-3">Priority</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Submitted</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map((c) => (
                <tr key={c.complaintId} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link to={`/admin/complaints/${c.complaintId}`} className="font-medium hover:text-brand-600">{c.title}</Link>
                    <p className="text-xs text-slate-500">{c.complaintId} · {c.category} · {c.studentId}</p>
                  </td>
                  <td className="px-3 py-3"><PriorityBadge priority={c.priority} /></td>
                  <td className="px-3 py-3">
                    <select value={c.status} disabled={busy === c.complaintId} onChange={(e) => changeStatus(c.complaintId, e.target.value)}
                      aria-label={`Status of ${c.complaintId}`}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[c.status]}`}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-3 text-slate-500">{fmtDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <EmptyState title="No matches" text="Try clearing some filters." />)}
      </div>
    </>
  )
}
