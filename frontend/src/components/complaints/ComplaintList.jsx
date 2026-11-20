import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { StatusBadge, PriorityBadge } from '../ui/Badges'
import { timeAgo } from '../../lib/format'

export default function ComplaintList({ complaints, basePath }) {
  return (
    <ul className="divide-y divide-slate-100">
      {complaints.map((c) => (
        <li key={c.complaintId}>
          <Link to={`${basePath}/${c.complaintId}`} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{c.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {c.complaintId} · {c.category} · {timeAgo(c.createdAt)}
              </p>
            </div>
            <div className="hidden shrink-0 gap-2 sm:flex">
              <PriorityBadge priority={c.priority} />
              <StatusBadge status={c.status} />
            </div>
            <ChevronRight size={16} className="shrink-0 text-slate-400" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
