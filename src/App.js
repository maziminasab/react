import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminPanel from './pages/AdminPanel';
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import Schedule from "./pages/Schedule";
import Grades from "./pages/Grades";
import TeacherDashboard from "./pages/TeacherDashboard";
import Attendance from "./pages/Attendance";
import Homework from "./pages/Homework";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/AdminPanel" element={<AdminPanel />} />
          <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/homework" element={<Homework />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;