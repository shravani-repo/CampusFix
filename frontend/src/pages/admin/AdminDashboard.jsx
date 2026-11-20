import { Link } from 'react-router-dom'
import { FileText, Clock, Loader, CheckCircle2, Siren } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import ComplaintList from '../../components/complaints/ComplaintList'
import { Spinner, ErrorState, EmptyState } from '../../components/ui/States'
import useFetch from '../../hooks/useFetch'
import { getComplaints } from '../../api/client'
import { countStatus, needsAttention } from '../../lib/stats'

export default function AdminDashboard() {
  const { data, error, loading, reload } = useFetch(() => getComplaints(), [])
  const counts = data ? countStatus(data) : {}
  const urgent = data ? needsAttention([...data]) : []
  const criticalOpen = urgent.filter((c) => c.priority === 'Critical').length

  return (
    <>
      <PageHeader title="Overview" subtitle="Campus-wide complaints at a glance." />
      {loading && <Spinner />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard icon={FileText} label="Total" value={data.length} tone="brand" />
            <StatCard icon={Clock} label="Pending" value={counts.Pending} tone="amber" />
            <StatCard icon={Loader} label="Processing" value={counts.Processing} tone="sky" />
            <StatCard icon={CheckCircle2} label="Resolved" value={counts.Resolved} tone="emerald" />
            <StatCard icon={Siren} label="Critical open" value={criticalOpen} tone="red" />
          </div>
          <section className="mt-8 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-display text-lg font-semibold">Needs attention</h2>
                <p className="text-xs text-slate-500">Open complaints, most urgent first</p>
              </div>
              <Link to="/admin/complaints" className="text-sm font-medium text-brand-600 hover:underline">Manage all</Link>
            </div>
            {urgent.length
              ? <ComplaintList complaints={urgent.slice(0, 6)} basePath="/admin/complaints" />
              : <EmptyState title="All clear" text="There are no open complaints." />}
          </section>
        </>
      )}
    </>
  )
}
