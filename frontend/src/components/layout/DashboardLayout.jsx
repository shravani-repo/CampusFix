import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FilePlus2, ListChecks, ClipboardList, BarChart3, LogOut, Menu, X,
} from 'lucide-react'
import Logo from '../ui/Logo'
import { useAuth } from '../../context/AuthContext'

const NAV = {
  student: [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/student/submit', label: 'Submit complaint', icon: FilePlus2 },
    { to: '/student/complaints', label: 'My complaints', icon: ListChecks },
  ],
  admin: [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/complaints', label: 'Manage complaints', icon: ClipboardList },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ],
}

export default function DashboardLayout({ role }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const link = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
    }`

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      {open && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white p-4 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-1 py-2">
          <Logo to={`/${role}`} />
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>
        <nav className="mt-6 flex flex-col gap-1">
          {NAV[role].map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={link} onClick={() => setOpen(false)}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-100 pt-4">
          <div className="px-1">
            <p className="truncate text-sm font-medium capitalize">{user?.name}</p>
            <p className="truncate text-xs capitalize text-slate-500">{role}</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/') }}
            className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <Logo to={`/${role}`} />
        </header>
        <main className="mx-auto max-w-6xl p-4 sm:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
