import { Loader2, Inbox, AlertTriangle } from 'lucide-react'

export const Spinner = ({ label = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500" role="status">
    <Loader2 className="animate-spin" size={18} /> {label}
  </div>
)

export const EmptyState = ({ title, text, action }) => (
  <div className="flex flex-col items-center py-14 text-center">
    <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400"><Inbox size={22} /></span>
    <p className="mt-3 font-medium">{title}</p>
    {text && <p className="mt-1 max-w-xs text-sm text-slate-500">{text}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
)

export const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center py-14 text-center" role="alert">
    <span className="grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-500"><AlertTriangle size={22} /></span>
    <p className="mt-3 font-medium">Something went wrong</p>
    <p className="mt-1 text-sm text-slate-500">{message}</p>
    {onRetry && <button onClick={onRetry} className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">Try again</button>}
  </div>
)
