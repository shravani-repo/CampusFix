// Complaint shape (same as the DynamoDB item):
// { complaintId, studentId, title, description, category, imageKey,
//   priority, status, createdAt, updatedAt, history: [{status, at, note}] }
import { detectPriority } from './priority'

const DAY = 86400000
const iso = (ms) => new Date(ms).toISOString()

function make(n, studentId, title, description, category, status, daysAgo) {
  const created = Date.now() - daysAgo * DAY
  const priority = detectPriority(title, description, category)
  const critical = priority === 'Critical'
  const history = [
    { status: 'Pending', at: iso(created), note: 'Complaint submitted' },
    {
      status: critical ? 'Processing' : 'Pending',
      at: iso(created + 60000),
      note: `Priority set to ${priority}` + (critical ? ' and escalated automatically' : ''),
    },
  ]
  const span = Math.min(daysAgo * DAY, 3 * DAY)
  if (status !== 'Pending' && !critical)
    history.push({ status: 'Processing', at: iso(created + span * 0.3), note: 'Marked as processing' })
  if (status === 'Resolved')
    history.push({ status: 'Resolved', at: iso(created + span * 0.8), note: 'Marked as resolved' })

  return {
    complaintId: `CF-${1000 + n}`, studentId, title, description, category,
    imageKey: null, priority, status,
    createdAt: iso(created), updatedAt: history[history.length - 1].at, history,
  }
}

export const mockComplaints = [
  make(1, 'stu-001', 'Projector not working in Room 204', 'The ceiling projector shows no signal. Lectures are being disrupted.', 'Classroom Equipment', 'Processing', 5),
  make(2, 'stu-001', 'Wi-Fi down in the library', 'No connectivity on floors 2 and 3 since Monday morning.', 'Wi-Fi / Network', 'Pending', 2),
  make(3, 'stu-001', 'Sparks from socket in Chemistry Lab', 'Socket near bench 5 sparked and smells of burning.', 'Electrical', 'Resolved', 12),
  make(4, 'stu-002', 'Water leak in hostel block B', 'Pipe leaking on the second-floor corridor, floor is wet.', 'Water Supply', 'Processing', 3),
  make(5, 'stu-002', 'Microscope lens cracked', 'Microscope #7 in the Biology Lab has a cracked objective lens.', 'Laboratory', 'Pending', 1),
  make(6, 'stu-001', 'Fans not working in Room 110', 'Three ceiling fans stopped working, the room gets very hot.', 'Classroom Equipment', 'Resolved', 9),
  make(7, 'stu-003', 'No water in boys hostel block A', 'There has been no water in the taps since early morning.', 'Water Supply', 'Resolved', 7),
  make(8, 'stu-003', 'Washrooms not cleaned on 2nd floor', 'The washrooms have not been cleaned for three days.', 'Cleanliness & Maintenance', 'Pending', 1),
  make(9, 'stu-002', 'Wi-Fi very slow in the canteen', 'Speeds are very slow in the evenings.', 'Wi-Fi / Network', 'Resolved', 10),
  make(10, 'stu-004', 'Tube lights flickering in Lab 3', 'Two tube lights flicker constantly and cause headaches.', 'Electrical', 'Processing', 4),
  make(11, 'stu-004', 'Frequent power cuts in seminar hall', 'The Block C seminar hall loses power several times a day.', 'Electrical', 'Processing', 2),
  make(12, 'stu-003', 'Gas leak smell in Chemistry Lab', 'A strong gas smell near the fume hood, we left the room.', 'Laboratory', 'Processing', 0.5),
  make(13, 'stu-001', 'Whiteboard markers missing', 'No markers in Room 305 for the past week.', 'Classroom Equipment', 'Resolved', 14),
  make(14, 'stu-004', 'Dirty water from drinking tap', 'The water cooler near the main gate gives brownish water.', 'Water Supply', 'Pending', 0.3),
  make(15, 'stu-002', 'Broken glass on library window', 'Broken glass on the window sill of the reading room.', 'Cleanliness & Maintenance', 'Processing', 6),
  make(16, 'stu-003', 'Mosquito breeding near hostel drain', 'Stagnant water in the drain behind block A.', 'Cleanliness & Maintenance', 'Resolved', 11),
]
