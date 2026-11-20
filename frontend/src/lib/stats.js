import { STATUSES, PRIORITIES, CATEGORIES } from '../constants'

export const countStatus = (list) =>
  Object.fromEntries(STATUSES.map((s) => [s, list.filter((c) => c.status === s).length]))

export const byStatus = (list) => STATUSES.map((name) => ({ name, value: list.filter((c) => c.status === name).length }))
export const byPriority = (list) => PRIORITIES.map((name) => ({ name, value: list.filter((c) => c.priority === name).length }))
export const byCategory = (list) =>
  CATEGORIES.map((name) => ({ name, value: list.filter((c) => c.category === name).length }))
    .sort((a, b) => b.value - a.value)

export function dailyTrend(list, days = 14) {
  const out = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const key = d.toDateString()
    out.push({
      day: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      Reported: list.filter((c) => new Date(c.createdAt).toDateString() === key).length,
      Resolved: list.filter((c) => {
        const r = c.history?.find((h) => h.status === 'Resolved')
        return r && new Date(r.at).toDateString() === key
      }).length,
    })
  }
  return out
}

export function avgResolutionHours(list) {
  const times = list.flatMap((c) => {
    const r = c.history?.find((h) => h.status === 'Resolved')
    return r ? [(new Date(r.at) - new Date(c.createdAt)) / 3600000] : []
  })
  return times.length ? times.reduce((a, b) => a + b, 0) / times.length : null
}

const RANK = { Critical: 0, High: 1, Medium: 2, Low: 3 }
export const needsAttention = (list) =>
  list
    .filter((c) => c.status !== 'Resolved')
    .sort((a, b) => (RANK[a.priority] ?? 4) - (RANK[b.priority] ?? 4) || a.createdAt.localeCompare(b.createdAt))
