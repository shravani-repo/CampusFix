// Mirror of backend/src/priority.py so mock mode behaves like production.
const LEVELS = ['Low', 'Medium', 'High', 'Critical']
const BASE = {
  'Classroom Equipment': 1, 'Wi-Fi / Network': 0, 'Water Supply': 1,
  'Electrical': 1, 'Laboratory': 1, 'Cleanliness & Maintenance': 0,
}
const CRITICAL = /\b(fire|smoke|spark\w*|short[- ]?circuit\w*|shock\w*|gas leak|burning|burnt|flood\w*|exposed wires?|sewage|collapse\w*|injur\w+)\b/
const HIGH = /\b(leak\w*|no water|no power|power (cut|cuts|outage)|blackout|broken glass|unsafe|hazard\w*|mosquito\w*|pests?|rats?)\b/
const URGENT = /\b(exam\w*|whole (building|block|hostel|campus)|entire (building|block|hostel|campus)|all students|many students|urgent\w*|emergency)\b/
const LOW = /\b(slow|minor|cosmetic|paint|small|slightly|suggestion|when possible)\b/

export function detectPriority(title, description, category) {
  const text = `${title} ${description}`.toLowerCase()
  let level = BASE[category] ?? 1
  if (CRITICAL.test(text)) return 'Critical'
  if (HIGH.test(text)) level = Math.max(level, 2)
  if (URGENT.test(text)) level = Math.min(level + 1, 3)
  else if (LOW.test(text) && level < 2) level = Math.max(level - 1, 0)
  return LEVELS[level]
}
