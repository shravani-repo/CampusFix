import { fmtDateTime } from '../../lib/format'

const dot = { Pending: 'bg-amber-500', Processing: 'bg-sky-500', Resolved: 'bg-emerald-500' }

export default function Timeline({ history = [] }) {
  return (
    <ol className="relative ml-2 border-l border-slate-200">
      {history.map((h, i) => (
        <li key={i} className="mb-5 ml-5 last:mb-0">
          <span className={`absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${dot[h.status]}`} />
          <p className="text-sm font-medium">{h.note}</p>
          <p className="text-xs text-slate-500">{fmtDateTime(h.at)}</p>
        </li>
      ))}
    </ol>
  )
}
