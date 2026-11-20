import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Logo from '../components/ui/Logo'
import { useAuth } from '../context/AuthContext'
import { USE_MOCK } from '../api/client'

export default function Login() {
  const [params] = useSearchParams()
  const [role, setRole] = useState(params.get('role') === 'admin' ? 'admin' : 'student')
  const [email, setEmail] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    const u = login({ email, role })
    navigate(`/${u.role}`)
  }
  const input = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100'

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="font-display text-2xl font-bold">Sign in</h1>
          <div className="mt-5 grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-sm font-medium">
            {['student', 'admin'].map((r) => (
              <button type="button" key={r} onClick={() => setRole(r)} aria-pressed={role === r}
                className={`rounded-md py-1.5 capitalize ${role === r ? 'bg-white shadow-sm' : 'text-slate-500'}`}>{r}</button>
            ))}
          </div>
          <label className="mt-5 block text-sm font-medium">Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" className={input} />
          </label>
          <label className="mt-4 block text-sm font-medium">Password
            <input type="password" required className={input} />
          </label>
          <button className="mt-6 w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Sign in</button>
          <p className="mt-3 text-center text-xs text-slate-500">
            Demo sign-in: any email and password works.{USE_MOCK && ' Running on sample data.'}
          </p>
        </form>
      </div>
    </div>
  )
}
