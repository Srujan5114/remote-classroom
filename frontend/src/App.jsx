import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import ScheduleClassPage from './pages/ScheduleClassPage';
import StudentClassesPage from './pages/StudentClassesPage';
import TeacherClassesPage from './pages/TeacherClassesPage';
import StudentDashboard from './pages/StudentDashboard';
import AssignmentsPage from './pages/AssignmentsPage';
import MaterialsPage from './pages/MaterialsPage';
import NotificationsPage from './pages/NotificationsPage';
import ChatPage from './pages/ChatPage';
import TeacherDashboard from './pages/TeacherDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/schedule-class" element={<ScheduleClassPage />} />
        <Route path="/student-classes" element={<StudentClassesPage />} />
        <Route path="/teacher-classes" element={<TeacherClassesPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
