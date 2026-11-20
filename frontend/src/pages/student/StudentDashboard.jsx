import { Link } from 'react-router-dom'
import { FileText, Clock, Loader, CheckCircle2, Plus } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import ComplaintList from '../../components/complaints/ComplaintList'
import { Spinner, ErrorState, EmptyState } from '../../components/ui/States'
import useFetch from '../../hooks/useFetch'
import { useAuth } from '../../context/AuthContext'
import { getComplaints } from '../../api/client'
import { countStatus } from '../../lib/stats'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { data, error, loading, reload } = useFetch(() => getComplaints({ studentId: user.studentId }), [user.studentId])
  const counts = data ? countStatus(data) : {}

  return (
    <>
      <PageHeader
        title={`Hi, ${user.name.split(' ')[0]}`}
        subtitle="Here is where your complaints stand."
        action={
          <Link to="/student/submit" className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            <Plus size={16} /> New complaint
          </Link>
        }
      />
      {loading && <Spinner />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={FileText} label="Total" value={data.length} tone="brand" />
            <StatCard icon={Clock} label="Pending" value={counts.Pending} tone="amber" />
            <StatCard icon={Loader} label="Processing" value={counts.Processing} tone="sky" />
            <StatCard icon={CheckCircle2} label="Resolved" value={counts.Resolved} tone="emerald" />
          </div>
          <section className="mt-8 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-display text-lg font-semibold">Recent complaints</h2>
              <Link to="/student/complaints" className="text-sm font-medium text-brand-600 hover:underline">View all</Link>
            </div>
            {data.length ? <ComplaintList complaints={data.slice(0, 5)} basePath="/student/complaints" /> : (
              <EmptyState title="No complaints yet" text="Spot a problem on campus? Report it and we'll track it for you." />
            )}
          </section>
        </>
      )}
    </>
  )
}
