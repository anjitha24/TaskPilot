import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';
import MemberDashboard from './pages/User/MemberDashboard';
import ProjectsPage from './pages/Admin/ProjectsPage';
import TeamPage from './pages/Admin/TeamPage';
import TasksPage from './pages/Admin/TasksPage';
import TeamMemberPage from './pages/User/TeamMemberPage';
import LeaderboardPage from './pages/LeaderboardPage';
import Chatbot from './components/Chatbot'; // ✅ ADDED: Import the new Chatbot component

// ✅ Aurora background import
import Aurora from './components/Aurora';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(() => localStorage.getItem('role') || '');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedUser) setUser(storedUser);
    if (storedRole) setRole(storedRole);
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <>
      {/* ✅ Aurora Background Effect */}
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />

      {/* ✅ Foreground UI */}
      <Navbar
        role={role}
        setRole={setRole}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} setRole={setRole} />} />
        <Route path="/register" element={<Register setUser={setUser} setRole={setRole} />} />

        <Route
          path="/dashboard"
          element={
            role === 'admin' ? (
              <AdminDashboard />
            ) : role === 'member' ? (
              <MemberDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/leaderboard" element={<LeaderboardPage />} />

        {/* Admin Pages */}
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/tasks" element={<TasksPage />} />

        {/* Member Page */}
        <Route path="/team-member" element={<TeamMemberPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* ✅ ADDED: Floating Chatbot will appear if the user has a role (is logged in) */}
      {role && <Chatbot />}
    </>
  );
}

export default App;