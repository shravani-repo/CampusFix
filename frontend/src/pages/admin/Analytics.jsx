import { CheckCircle2, Timer, FileText, Siren } from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import { Spinner, ErrorState } from '../../components/ui/States'
import useFetch from '../../hooks/useFetch'
import { getComplaints } from '../../api/client'
import { byStatus, byPriority, byCategory, dailyTrend, avgResolutionHours } from '../../lib/stats'
import { STATUS_COLORS, PRIORITY_COLORS } from '../../constants'

const Card = ({ title, children }) => (
  <section className="rounded-xl border border-slate-200 bg-white p-5">
    <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
    <div className="h-64">{children}</div>
  </section>
)

export default function Analytics() {
  const { data, error, loading, reload } = useFetch(() => getComplaints(), [])
  if (loading) return <Spinner />
  if (error) return <ErrorState message={error} onRetry={reload} />

  const resolved = data.filter((c) => c.status === 'Resolved').length
  const rate = data.length ? Math.round((resolved / data.length) * 100) : 0
  const avg = avgResolutionHours(data)
  const critical = data.filter((c) => c.priority === 'Critical').length

  return (
    <>
      <PageHeader title="Analytics" subtitle="Complaint trends across the campus." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Total complaints" value={data.length} tone="brand" />
        <StatCard icon={CheckCircle2} label="Resolution rate" value={`${rate}%`} tone="emerald" />
        <StatCard icon={Timer} label="Avg. time to resolve" value={avg === null ? '–' : avg < 48 ? `${Math.round(avg)} hrs` : `${(avg / 24).toFixed(1)} days`} tone="sky" />
        <StatCard icon={Siren} label="Critical issues" value={critical} tone="red" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Reported vs resolved (14 days)">
          <ResponsiveContainer>
            <LineChart data={dailyTrend(data)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} interval={2} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
              <Tooltip /><Legend />
              <Line type="monotone" dataKey="Reported" stroke="#4f46e5" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Resolved" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="By status">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={byStatus(data)} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {byStatus(data).map((d) => <Cell key={d.name} fill={STATUS_COLORS[d.name]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="By category">
          <ResponsiveContainer>
            <BarChart data={byCategory(data)} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" name="Complaints" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="By priority">
          <ResponsiveContainer>
            <BarChart data={byPriority(data)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
              <Tooltip />
              <Bar dataKey="value" name="Complaints" radius={[4, 4, 0, 0]}>
                {byPriority(data).map((d) => <Cell key={d.name} fill={PRIORITY_COLORS[d.name]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </>
  )
}
