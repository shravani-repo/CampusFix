import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import StudentDashboard from './pages/student/StudentDashboard'
import SubmitComplaint from './pages/student/SubmitComplaint'
import MyComplaints from './pages/student/MyComplaints'
import ComplaintDetails from './pages/student/ComplaintDetails'
import AdminDashboard from './pages/admin/AdminDashboard'
import ComplaintManagement from './pages/admin/ComplaintManagement'
import Analytics from './pages/admin/Analytics'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route path="/student" element={<ProtectedRoute role="student"><DashboardLayout role="student" /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="submit" element={<SubmitComplaint />} />
            <Route path="complaints" element={<MyComplaints />} />
            <Route path="complaints/:id" element={<ComplaintDetails />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute role="admin"><DashboardLayout role="admin" /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="complaints" element={<ComplaintManagement />} />
            <Route path="complaints/:id" element={<ComplaintDetails />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
