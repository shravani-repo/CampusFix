import { STATUS_STYLES, PRIORITY_STYLES } from '../../constants'

const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap'

export const StatusBadge = ({ status }) => (
  <span className={`${base} ${STATUS_STYLES[status] ?? ''}`}>{status}</span>
)

export const PriorityBadge = ({ priority }) =>
  priority ? (
    <span className={`${base} ${PRIORITY_STYLES[priority]}`}>{priority}</span>
  ) : (
    <span className={`${base} border-dashed bg-white text-slate-400 ring-slate-200`}>Assessing…</span>
  )
