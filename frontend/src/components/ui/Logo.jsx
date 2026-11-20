import { Link } from 'react-router-dom'
import { CheckCheck } from 'lucide-react'

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white"><CheckCheck size={18} /></span>
      <span className="font-display text-xl font-bold tracking-tight">CampusFix</span>
    </Link>
  )
}
