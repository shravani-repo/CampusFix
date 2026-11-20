import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { StatusBadge, PriorityBadge } from '../../components/ui/Badges'
import Timeline from '../../components/complaints/Timeline'
import { Spinner, ErrorState } from '../../components/ui/States'
import useFetch from '../../hooks/useFetch'
import { useAuth } from '../../context/AuthContext'
import { getComplaint, updateComplaintStatus } from '../../api/client'
import { fmtDateTime } from '../../lib/format'
import { STATUSES } from '../../constants'

// Shared by students (read-only) and admins (can change status)
export default function ComplaintDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const isAdmin = user.role === 'admin'
  const back = isAdmin ? '/admin/complaints' : '/student/complaints'
  const { data: c, setData, error, loading, reload } = useFetch(() => getComplaint(id), [id])

  const change = async (status) => {
    const updated = await updateComplaintStatus(id, status)
    setData({ ...c, ...updated })
  }

  if (loading) return <Spinner />
  if (error) return <ErrorState message={error} onRetry={reload} />

  return (
    <>
      <Link to={back} className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-brand-600">
        <ArrowLeft size={16} /> Back to complaints
      </Link>
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-medium text-slate-500">{c.complaintId}</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">{c.title}</h1>
          <div className="mt-3 flex gap-2"><PriorityBadge priority={c.priority} /><StatusBadge status={c.status} /></div>
          <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-slate-700">{c.description}</p>
          {c.imageUrl && <img src={c.imageUrl} alt="Attached by the student" className="mt-5 max-h-80 rounded-lg border border-slate-200" />}
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-sm">
            <div><dt className="text-slate-500">Category</dt><dd className="font-medium">{c.category}</dd></div>
            <div><dt className="text-slate-500">Reported by</dt><dd className="font-medium">{c.studentId}</dd></div>
            <div><dt className="text-slate-500">Submitted</dt><dd className="font-medium">{fmtDateTime(c.createdAt)}</dd></div>
            <div><dt className="text-slate-500">Last update</dt><dd className="font-medium">{fmtDateTime(c.updatedAt)}</dd></div>
          </dl>
        </section>

        <aside className="space-y-6">
          {isAdmin && (
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="font-display text-lg font-semibold">Update status</h2>
              <div className="mt-3 grid gap-2">
                {STATUSES.map((s) => (
                  <button key={s} disabled={c.status === s} onClick={() => change(s)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:border-brand-200 disabled:bg-brand-50 disabled:text-brand-700">
                    {c.status === s ? `Current: ${s}` : `Mark as ${s.toLowerCase()}`}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 font-display text-lg font-semibold">Progress</h2>
            <Timeline history={c.history} />
          </div>
        </aside>
      </div>
    </>
  )
}
