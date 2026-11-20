import { Link } from 'react-router-dom'
import {
  Camera,
  Gauge,
  Route,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import Logo from '../components/ui/Logo'

const features = [
  {
    icon: Camera,
    title: 'Easy Reporting',
    text: 'Report campus issues with descriptions, categories and photos.',
    number: '01',
  },
  {
    icon: Gauge,
    title: 'Smart Prioritization',
    text: 'Automatically identify urgent complaints and prioritize them.',
    number: '02',
  },
  {
    icon: Route,
    title: 'Live Tracking',
    text: 'Follow your complaint from submission to final resolution.',
    number: '03',
  },
  {
    icon: BarChart3,
    title: 'Campus Insights',
    text: 'Give administrators a clear view of campus issues and trends.',
    number: '04',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8f9fc] text-slate-900">

      {/* Navbar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Logo />

        <div className="flex items-center gap-3">
          <Link
            to="/login?role=admin"
            className="hidden rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-indigo-600 sm:block"
          >
            Admin
          </Link>

          <Link
            to="/login"
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-indigo-600"
          >
            Get Started <ArrowRight className="ml-2 inline" size={15} />
          </Link>
        </div>
      </header>

      <main>

        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-10 lg:pb-32 lg:pt-24">

          <div className="pointer-events-none absolute -right-40 -top-20 h-[500px] w-[500px] rounded-full bg-indigo-200/30 blur-[100px]" />
          <div className="pointer-events-none absolute -left-40 bottom-0 h-[350px] w-[350px] rounded-full bg-blue-200/30 blur-[100px]" />

          <div className="relative grid items-center gap-16 lg:grid-cols-2">

            {/* Hero Content */}
            <div className="animate-fade-up">

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-semibold text-indigo-600 shadow-sm">
                <Sparkles size={14} />
                A smarter way to manage campus issues
              </div>

              <h1 className="max-w-2xl font-display text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                A better campus
                <span className="block text-indigo-600">
                  starts here.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-8 text-slate-500 sm:text-lg">
                One platform to report concerns, track progress and make
                campus life better. Because every issue deserves attention.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">

                <Link
                  to="/login"
                  className="inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-indigo-600/20 transition hover:-translate-y-1 hover:bg-indigo-700"
                >
                  Report an Issue
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/login?role=admin"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
                >
                  Admin Portal
                </Link>

              </div>

              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Easy reporting
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Smart tracking
                </span>
              </div>
            </div>

            {/* Minimal CampusFix Visual */}
            <div className="animate-soft-fade relative flex items-center justify-center">

              <div className="absolute h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />

              <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-indigo-100 bg-white shadow-2xl shadow-indigo-200/40 sm:h-96 sm:w-96">

                <div className="absolute inset-5 rounded-full border border-dashed border-indigo-200" />

                <div className="flex flex-col items-center text-center">

                  <div className="rounded-3xl bg-indigo-600 p-6 text-white shadow-xl shadow-indigo-600/25">
                    <ShieldCheck size={55} strokeWidth={1.5} />
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-bold text-slate-900">
                    CampusFix
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Report. Track. Resolve.
                  </p>

                </div>

                <div className="absolute right-5 top-12 rounded-2xl bg-white p-3 text-indigo-600 shadow-lg">
                  <Camera size={22} />
                </div>

                <div className="absolute bottom-12 left-5 rounded-2xl bg-white p-3 text-emerald-600 shadow-lg">
                  <CheckCircle2 size={22} />
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* Features Section */}
        <section className="relative border-t border-slate-200/70 bg-white py-24">

          <div className="mx-auto max-w-7xl px-6 lg:px-10">

            <div className="mx-auto mb-14 max-w-2xl text-center">

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Why CampusFix?
              </span>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Everything your campus needs.
                <span className="block text-indigo-600">
                  All in one place.
                </span>
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                From reporting everyday problems to tracking their resolution,
                CampusFix makes campus management simpler.
              </p>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {features.map(({ icon: Icon, title, text, number }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-slate-100 bg-[#fafbff] p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-900/5"
                >

                  <div className="flex items-center justify-between">

                    <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                      <Icon size={22} />
                    </div>

                    <span className="text-xs font-semibold text-slate-300">
                      {number}
                    </span>

                  </div>

                  <h3 className="mt-6 font-display text-lg font-bold">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {text}
                  </p>

                </div>
              ))}

            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-white px-6 pb-20">

          <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-slate-900 px-8 py-14 text-center sm:px-16">

            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Let's make campus better.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">
              Your voice matters. Start reporting issues and help create a
              better campus experience for everyone.
            </p>

            <Link
              to="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-1 hover:bg-indigo-50"
            >
              Get Started <ArrowRight size={16} />
            </Link>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-7">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-slate-400 sm:flex-row lg:px-10">
          <Logo />
          <p>Making campus better, together.</p>
        </div>
      </footer>

    </div>
  )
}