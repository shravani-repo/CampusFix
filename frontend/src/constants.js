export const CATEGORIES = [
  'Classroom Equipment', 'Wi-Fi / Network', 'Water Supply',
  'Electrical', 'Laboratory', 'Cleanliness & Maintenance',
]
export const STATUSES = ['Pending', 'Processing', 'Resolved']
export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

export const STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  Processing: 'bg-sky-50 text-sky-700 ring-sky-200',
  Resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}
export const PRIORITY_STYLES = {
  Low: 'bg-slate-100 text-slate-600 ring-slate-200',
  Medium: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  High: 'bg-orange-50 text-orange-700 ring-orange-200',
  Critical: 'bg-red-50 text-red-700 ring-red-200',
}
// Hex colors for charts
export const STATUS_COLORS = { Pending: '#f59e0b', Processing: '#0ea5e9', Resolved: '#10b981' }
export const PRIORITY_COLORS = { Low: '#94a3b8', Medium: '#eab308', High: '#f97316', Critical: '#ef4444' }
