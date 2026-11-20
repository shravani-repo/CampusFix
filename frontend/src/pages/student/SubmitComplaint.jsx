import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ImagePlus, X, CheckCircle2, Loader2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import { CATEGORIES } from '../../constants'
import { submitComplaint, uploadImage } from '../../api/client'

const MAX_MB = 5
const TYPES = ['image/jpeg', 'image/png', 'image/webp']
const empty = { title: '', category: '', description: '' }

export default function SubmitComplaint() {
  const [form, setForm] = useState(empty)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null)

  useEffect(() => {
    if (!file) return setPreview(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const pickFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (!TYPES.includes(f.type)) return setErrors({ ...errors, file: 'Use a JPEG, PNG or WebP image' })
    if (f.size > MAX_MB * 1024 * 1024) return setErrors({ ...errors, file: `Image must be under ${MAX_MB} MB` })
    setErrors({ ...errors, file: undefined })
    setFile(f)
  }

  const validate = () => {
    const e = {}
    if (form.title.trim().length < 3) e.title = 'Give your complaint a short title (3+ characters)'
    if (!form.category) e.category = 'Choose a category'
    if (form.description.trim().length < 10) e.description = 'Describe the problem in at least 10 characters'
    return e
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    setSubmitting(true)
    try {
      const imageKey = file ? await uploadImage(file) : null
      const c = await submitComplaint({ ...form, title: form.title.trim(), description: form.description.trim(), imageKey })
      setDone(c)
    } catch (err) {
      setErrors({ form: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  if (done)
    return (
      <div className="mx-auto mt-10 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto text-emerald-500" size={44} />
        <h1 className="mt-4 font-display text-2xl font-bold">Complaint submitted</h1>
        <p className="mt-2 text-sm text-slate-600">
          Your reference is <strong>{done.complaintId}</strong>. We are assigning a priority automatically, so check back in a moment.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to={`/student/complaints/${done.complaintId}`} className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Track it</Link>
          <button onClick={() => { setDone(null); setForm(empty); setFile(null) }} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50">Report another</button>
        </div>
      </div>
    )

  const field = 'mt-1 w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100'
  const cls = (k) => `${field} ${errors[k] ? 'border-red-400' : 'border-slate-300 focus:border-brand-500'}`
  const Err = ({ k }) => errors[k] ? <p className="mt-1 text-xs text-red-600" role="alert">{errors[k]}</p> : null

  return (
    <>
      <PageHeader title="Submit a complaint" subtitle="Tell us what is wrong and where. A photo helps." />
      <form onSubmit={onSubmit} noValidate className="max-w-2xl space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <label className="block text-sm font-medium">Title
          <input value={form.title} onChange={set('title')} maxLength={120} placeholder="e.g. Projector not working in Room 204" className={cls('title')} />
          <Err k="title" />
        </label>
        <label className="block text-sm font-medium">Category
          <select value={form.category} onChange={set('category')} className={cls('category')}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <Err k="category" />
        </label>
        <label className="block text-sm font-medium">Description
          <textarea value={form.description} onChange={set('description')} rows={5} maxLength={2000}
            placeholder="What happened, where exactly, and since when?" className={cls('description')} />
          <Err k="description" />
        </label>

        <div>
          <p className="text-sm font-medium">Photo <span className="font-normal text-slate-500">(optional, max {MAX_MB} MB)</span></p>
          {preview ? (
            <div className="relative mt-2 inline-block">
              <img src={preview} alt="Selected upload preview" className="max-h-48 rounded-lg border border-slate-200" />
              <button type="button" onClick={() => setFile(null)} aria-label="Remove photo"
                className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-white"><X size={14} /></button>
            </div>
          ) : (
            <label className="mt-2 flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-slate-300 py-8 text-sm text-slate-500 hover:border-brand-500 hover:bg-brand-50">
              <ImagePlus size={24} className="mb-2" /> Click to choose an image
              <input type="file" accept={TYPES.join(',')} onChange={pickFile} className="sr-only" />
            </label>
          )}
          <Err k="file" />
        </div>

        {errors.form && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{errors.form}</p>}

        <button disabled={submitting} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
          {submitting && <Loader2 className="animate-spin" size={16} />} {submitting ? 'Submitting…' : 'Submit complaint'}
        </button>
      </form>
    </>
  )
}
