import { useState } from 'react'
import { Search } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import ComplaintList from '../../components/complaints/ComplaintList'
import { Spinner, ErrorState, EmptyState } from '../../components/ui/States'
import useFetch from '../../hooks/useFetch'
import { useAuth } from '../../context/AuthContext'
import { getComplaints } from '../../api/client'
import { STATUSES } from '../../constants'

export default function MyComplaints() {
  const { user } = useAuth()
  const { data, error, loading, reload } = useFetch(() => getComplaints({ studentId: user.studentId }), [user.studentId])
  const [tab, setTab] = useState('All')
  const [q, setQ] = useState('')

  const shown = (data ?? []).filter(
    (c) => (tab === 'All' || c.status === tab) && `${c.title} ${c.complaintId}`.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <>
      <PageHeader title="My complaints" subtitle="Everything you have reported." />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg bg-slate-100 p-1 text-sm font-medium">
          {['All', ...STATUSES].map((t) => (
            <button key={t} onClick={() => setTab(t)} aria-pressed={tab === t}
              className={`rounded-md px-3 py-1.5 ${tab === t ? 'bg-white shadow-sm' : 'text-slate-500'}`}>{t}</button>
          ))}
        </div>
        <label className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" aria-label="Search complaints"
            className="w-56 rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" />
        </label>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        {loading && <Spinner />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {data && (shown.length
          ? <ComplaintList complaints={shown} basePath="/student/complaints" />
          : <EmptyState title="Nothing here" text="No complaints match this filter." />)}
      </div>
    </>
  )
}
