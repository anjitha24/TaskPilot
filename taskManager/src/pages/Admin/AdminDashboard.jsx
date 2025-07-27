import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import OverviewCard from '../../components/OverviewCard';
import TaskCalendar from '../../components/TaskCalendar';
import CreateBadgeForm from '../../components/CreateBadgeForm'; // ✅ ADDED: Import the new form

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/summary/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    } catch (err) {
      console.error('❌ Failed to load dashboard summary:', err);
    }
  };

  return (
    <>
      <style>{`
        body {
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
        }
        
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%);
          pointer-events: none;
          z-index: -1;
        }
        
        .container {
          backdrop-filter: blur(25px);
          background: rgba(15, 15, 35, 0.4);
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          padding: 40px;
          margin: 30px auto;
          color: white;
          position: relative;
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
          border-radius: 30px;
          pointer-events: none;
        }
        
        .container h2 {
          color: #ffffff;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
          font-weight: 800;
          margin-bottom: 2.5rem;
          font-size: 2.5rem;
          background: linear-gradient(135deg, #ffffff 0%, #a8a8ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* Cards Styling */
        .card {
          backdrop-filter: blur(20px);
          background: rgba(15, 15, 35, 0.7) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 25px !important;
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
          border-radius: 25px;
          pointer-events: none;
        }
        
        .card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          background: rgba(15, 15, 35, 0.8) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
        
        .card-body {
          color: white !important;
          padding: 2rem;
        }
        
        .card-title {
          color: #ffffff !important;
          font-weight: 700;
          font-size: 1.4rem;
          margin-bottom: 1rem;
          text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
        }
        
        .card-text {
          color: rgba(255, 255, 255, 0.9) !important;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        /* Primary Cards (Summary) */
        .text-bg-primary {
          background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%) !important;
          border: 1px solid rgba(66, 165, 245, 0.3) !important;
        }
        
        .text-bg-success {
          background: linear-gradient(135deg, #28a745 0%, #4caf50 100%) !important;
          border: 1px solid rgba(76, 175, 80, 0.3) !important;
        }
        
        .text-bg-warning {
          background: linear-gradient(135deg, #ffc107 0%, #ffeb3b 100%) !important;
          border: 1px solid rgba(255, 235, 59, 0.3) !important;
          color: #000 !important;
        }
        
        .text-bg-warning .card-title,
        .text-bg-warning .card-text {
          color: #000 !important;
          text-shadow: none;
        }
        
        /* Task Breakdown Cards */
        .border-success {
          border: 2px solid #28a745 !important;
          background: rgba(40, 167, 69, 0.1) !important;
        }
        
        .border-warning {
          border: 2px solid #ffc107 !important;
          background: rgba(255, 193, 7, 0.1) !important;
        }
        
        .border-secondary {
          border: 2px solid #6c757d !important;
          background: rgba(108, 117, 125, 0.1) !important;
        }
        
        .text-success {
          color: #4caf50 !important;
          font-weight: 600;
        }
        
        .text-warning {
          color: #ffc107 !important;
          font-weight: 600;
        }
        
        .text-secondary {
          color: #adb5bd !important;
          font-weight: 600;
        }
        
        /* Buttons */
        .btn-primary {
          background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%) !important;
          border: none !important;
          border-radius: 15px !important;
          padding: 12px 30px !important;
          font-weight: 600 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 
            0 8px 20px rgba(25, 118, 210, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
          text-decoration: none !important;
          display: inline-block !important;
        }
        
        .btn-primary:hover {
          transform: translateY(-3px) scale(1.05) !important;
          box-shadow: 
            0 12px 30px rgba(25, 118, 210, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
          background: linear-gradient(135deg, #1565c0 0%, #2196f3 100%) !important;
        }
        
        .btn-primary:active {
          transform: translateY(-1px) scale(1.02) !important;
        }
        
        /* Font sizes */
        .fs-3 {
          font-size: 2.5rem !important;
          font-weight: 700 !important;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        /* Row spacing */
        .row {
          margin-bottom: 2rem;
        }
        
        .g-4 > * {
          padding: 1rem;
        }
        
        /* Overview Cards Container */
        .mb-4 {
          margin-bottom: 2rem !important;
        }
        
        /* Enhanced scrollbar styling */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(15, 15, 35, 0.3);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, rgba(168, 168, 255, 0.6), rgba(255, 119, 198, 0.6));
          border-radius: 10px;
          border: 2px solid rgba(15, 15, 35, 0.3);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, rgba(168, 168, 255, 0.8), rgba(255, 119, 198, 0.8));
        }
        
        /* Animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-50px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .container { margin: 15px; padding: 20px; }
          .container h2 { font-size: 2rem; }
          .card-body { padding: 1.5rem; }
        }
        
        /* Overview Cards dark theme styling */
        [class*="overview-card"] {
          backdrop-filter: blur(20px);
          background: rgba(15, 15, 35, 0.7) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 25px !important;
          color: white !important;
        }
        
        [class*="overview-card"] h5,
        [class*="overview-card"] h6,
        [class*="overview-card"] .card-title {
          color: white !important;
        }
        
        [class*="overview-card"] .card-text {
          color: rgba(255, 255, 255, 0.9) !important;
        }

        /* ✅ ADDED: FullCalendar Dark Theme Overrides */
        .fc {
          color: white; 
        }
        .fc .fc-toolbar-title {
          color: #ffffff;
          font-size: 1.75rem !important;
          font-weight: 600 !important;
        }
        .fc .fc-button-primary {
          background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          text-transform: capitalize !important;
          box-shadow: none !important;
        }
        .fc .fc-button-primary:hover {
          background: linear-gradient(135deg, #1565c0 0%, #2196f3 100%) !important;
        }
        .fc .fc-daygrid-day-frame, .fc .fc-timegrid-slot-lane {
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: background-color 0.3s;
        }
        .fc .fc-daygrid-day:hover .fc-daygrid-day-frame {
          background-color: rgba(255, 255, 255, 0.05);
        }
        .fc .fc-col-header-cell {
          background-color: rgba(15, 15, 35, 0.5);
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .fc .fc-day-today .fc-daygrid-day-frame {
          background-color: rgba(66, 165, 245, 0.2) !important;
          border: 1px solid #42a5f5;
        }
        .fc .fc-event {
          border-radius: 5px !important;
          padding: 3px 6px !important;
          font-weight: 500 !important;
          border: 1px solid rgba(0,0,0,0.3) !important;
          font-size: 0.8rem !important;
        }
        .fc-h-event {
          border-color: transparent !important;
        }
        .fc-theme-standard .fc-scrollgrid {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>

      <div className="container mt-5 pt-3">
        <h2 className="mb-4">📊 Admin Dashboard</h2>

        {/* Navigation Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Projects</h5>
                <p className="card-text">Manage all your projects and timelines efficiently.</p>
                <Link to="/projects" className="btn btn-primary">View Projects</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Team</h5>
                <p className="card-text">Manage your team members and roles.</p>
                <Link to="/team" className="btn btn-primary">Manage Team</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Tasks</h5>
                <p className="card-text">Create, assign, and track team tasks easily.</p>
                <Link to="/tasks" className="btn btn-primary">Manage Tasks</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card text-bg-primary">
              <div className="card-body">
                <h5 className="card-title">Projects</h5>
                <p className="card-text fs-3">{summary.totalProjects || 0}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-bg-success">
              <div className="card-body">
                <h5 className="card-title">Team Members</h5>
                <p className="card-text fs-3">{summary.totalUsers || 0}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-bg-warning">
              <div className="card-body">
                <h5 className="card-title">Total Tasks</h5>
                <p className="card-text fs-3">{summary.totalTasks || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="row mb-4">
          <OverviewCard label="Total Tasks" value={42} color="#1976d2" />
          <OverviewCard label="Completed" value={25} color="#28a745" />
          <OverviewCard label="Pending" value={17} color="#ffc107" />
        </div>

        {/* Task Breakdown */}
        <div className="row g-4 mt-4">
          <div className="col-md-4">
            <div className="card border-success">
              <div className="card-body text-success">
                <h6>✅ Completed</h6>
                <h5>{summary.completedTasks || 0}</h5>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-warning">
              <div className="card-body text-warning">
                <h6>🟡 In Progress</h6>
                <h5>{summary.inProgressTasks || 0}</h5>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-secondary">
              <div className="card-body text-secondary">
                <h6>📝 To Do</h6>
                <h5>{summary.todoTasks || 0}</h5>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar and Badge Creation Section */}
        <div className="row mt-4 align-items-stretch">
          <div className="col-lg-8 mb-4 mb-lg-0">
            <div className="card h-100">
              <div className="card-body">
                <TaskCalendar />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            {/* ✅ ADDED: Create Badge Form */}
            <CreateBadgeForm />
          </div>
        </div>

      </div>
    </>
  );
};

export default AdminDashboard;