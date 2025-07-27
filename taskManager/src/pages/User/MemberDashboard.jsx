import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import ProgressBar from '../../components/ProgressBar';
import TaskChart from '../../components/TaskChart';
import TaskCalendar from '../../components/TaskCalendar';

const MemberDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [commentInput, setCommentInput] = useState({});
  
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planText, setPlanText] = useState('');
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      if (!token) { return; }
      const res = await axios.get('http://localhost:8000/api/tasks/user/me', authHeader);
      setTasks(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch tasks:", err.response?.data || err.message);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/tasks/${taskId}`, { status: newStatus }, authHeader);
      fetchTasks();
    } catch (err) { console.error("❌ Failed to update status:", err); }
  };

  const handleCommentChange = (taskId, text) => {
    setCommentInput(prev => ({ ...prev, [taskId]: text }));
  };

  const submitComment = async (taskId) => {
    if (!commentInput[taskId]) return;
    try {
      await axios.post(`http://localhost:8000/api/tasks/${taskId}/comment`, { text: commentInput[taskId] }, authHeader);
      setCommentInput(prev => ({ ...prev, [taskId]: '' }));
      fetchTasks(); 
    } catch (err) { console.error("❌ Failed to add comment:", err); }
  };

  const handleGetPlan = async () => {
    setIsLoadingPlan(true);
    setIsPlanModalOpen(true);
    setPlanText('');
    try {
      const res = await axios.post('http://localhost:8000/api/tasks/user/me/plan', {}, authHeader);
      setPlanText(res.data.plan);
    } catch (err) {
      setPlanText("Sorry, an error occurred while generating your plan.");
      console.error("❌ Failed to get plan:", err);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const completed = tasks.filter(t => t.status === "Done").length;

  const getStatusIcon = (status) => {
    switch (status) {
      case "Done": return "✅";
      case "In Progress": return "🔄";
      default: return "📋";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Done": return "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)";
      case "In Progress": return "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)";
      default: return "linear-gradient(135deg, #9E9E9E 0%, #757575 100%)";
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        
        body { 
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); 
          min-height: 100vh; 
        }
        
        .dashboard-wrapper { 
          backdrop-filter: blur(25px); 
          background: rgba(15, 15, 35, 0.4); 
          border-radius: 30px; 
          border: 1px solid rgba(255, 255, 255, 0.1); 
          padding: 40px; 
          margin: 30px auto; 
          color: white;
        }
        
        @keyframes containerFadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .dashboard-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 2.5rem;
        }
        
        .dashboard-header h3 { 
          margin-bottom: 0; 
          background: linear-gradient(135deg, #ffffff 0%, #a8a8ff 100%); 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
          background-clip: text; 
          font-size: 2.5rem; 
          font-weight: 800;
        }
        
        .section-card { 
          backdrop-filter: blur(20px); 
          background: rgba(15, 15, 35, 0.6); 
          border-radius: 25px; 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          padding: 30px; 
          margin-bottom: 2rem;
        }
        
        .section-card h4 {
          color: #e8e8ff;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 20px;
        }
        
        .list-group { 
          border: none; 
          gap: 25px;
        }
        
        .task-item { 
          backdrop-filter: blur(20px); 
          background: rgba(15, 15, 35, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          color: white;
          padding: 30px;
          position: relative;
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }
        
        .task-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--status-color, linear-gradient(135deg, #9E9E9E 0%, #757575 100%));
          border-radius: 25px 25px 0 0;
        }
        
        .task-item:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .task-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: #f0f0ff;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .task-description {
          color: #c0c0d0;
          line-height: 1.5;
          margin-bottom: 15px;
        }
        
        .task-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .due-date {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #a8a8ff;
          font-weight: 500;
        }
        
        .status-badge {
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--status-color, linear-gradient(135deg, #9E9E9E 0%, #757575 100%));
          color: white;
          border: none;
          display: flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .form-select, .form-control { 
          background: rgba(15, 15, 35, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 18px;
          color: white;
          padding: 12px 16px;
          transition: all 0.3s ease;
        }
        
        .form-select:focus, .form-control:focus {
          border-color: rgba(168, 168, 255, 0.4);
          box-shadow: 0 0 15px rgba(168, 168, 255, 0.2);
          background: rgba(15, 15, 35, 0.9);
          outline: none;
        }
        
        .form-select option {
          background: #1a1a2e;
          color: white;
        }
        
        .comment-input {
          position: relative;
          margin-top: 15px;
        }
        
        .comment-input input {
          padding-left: 40px;
        }
        
        .comment-input::before {
          content: '💬';
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
        }
        
        .comments-list {
          margin-top: 20px;
          padding: 0;
          list-style: none;
          max-height: 180px;
          overflow-y: auto;
        }
        
        .comment-item {
          background: rgba(0, 0, 0, 0.25);
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 12px;
          border-left: 2px solid rgba(168, 168, 255, 0.4);
          font-size: 0.9rem;
          line-height: 1.4;
        }
        
        .comment-timestamp {
          color: #888;
          font-size: 0.75rem;
          margin-top: 4px;
        }
        
        .btn-ai { 
          background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
          border: none;
          color: white;
          border-radius: 15px;
          padding: 12px 24px;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(155, 89, 182, 0.3);
          transition: all 0.3s ease;
        }
        
        .btn-ai:hover { 
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(155, 89, 182, 0.4);
        }
        
        .ai-modal-overlay { 
          position: fixed; 
          top: 0; 
          left: 0; 
          width: 100%; 
          height: 100%; 
          background: rgba(0,0,0,0.9); 
          backdrop-filter: blur(15px); 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          z-index: 1050;
          animation: modalFadeIn 0.3s ease-out;
        }
        
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .ai-modal-content { 
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 15, 35, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.15); 
          border-radius: 25px; 
          padding: 40px; 
          color: white; 
          width: 90%; 
          max-width: 700px; 
          max-height: 80vh; 
          overflow-y: auto;
          backdrop-filter: blur(30px);
          box-shadow: 
            0 25px 80px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          animation: modalSlideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          position: relative;
        }
        
        @keyframes modalSlideIn {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        .ai-modal-content h4 { 
          margin-top: 0; 
          color: #a8a8ff;
          font-size: 1.8rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 30px;
        }
        
        .ai-modal-content strong { color: #ff88cc; }
        .ai-modal-content ul { padding-left: 25px; list-style-type: none; }
        .ai-modal-content ul li::before {
          content: '✨';
          margin-right: 10px;
        }
        .ai-modal-content li { 
          margin-bottom: 15px; 
          line-height: 1.8;
          color: #e0e0f0;
        }
        
        .loading-spinner { 
          border: 4px solid rgba(255,255,255,0.1); 
          border-top: 4px solid #a8a8ff; 
          border-radius: 50%; 
          width: 60px; 
          height: 60px; 
          animation: spin 1s linear infinite; 
          margin: 60px auto;
          box-shadow: 0 0 20px rgba(168, 168, 255, 0.3);
        }
        
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 40px;
          color: #888;
        }
        
        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }
        
        .empty-state-text {
          font-size: 1.2rem;
          font-weight: 500;
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #a8a8ff, #ff88cc);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #9999ff, #ff77bb);
        }
      `}</style>

      <div className="dashboard-wrapper container">
        <div className="dashboard-header">
          <h3>🧑‍💻 My Tasks</h3>
          <button className="btn btn-ai" onClick={handleGetPlan}>
            🤖 Plan My Day
          </button>
        </div>
        
        {tasks.length > 0 && (
          <div className="section-card">
            <h4>📊 Task Completion</h4>
            <ProgressBar total={tasks.length} completed={completed} />
            <TaskChart tasks={tasks} />
          </div>
        )}

        <div className="section-card">
          <h4>📅 Calendar View</h4>
          <TaskCalendar />
        </div>

        <div className="section-card">
          <h4>📋 Task List</h4>
          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">No tasks assigned to you yet.</div>
            </div>
          ) : (
            <ul className="list-group">
              {tasks.map((task, index) => (
                <li 
                  key={task._id} 
                  className="task-item"
                  style={{
                    '--status-color': getStatusColor(task.status)
                  }}
                >
                  <div className="task-title">
                    {getStatusIcon(task.status)}
                    {task.title}
                  </div>
                  
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  
                  <div className="task-meta">
                    <div className="due-date">
                      📅 <strong>Due:</strong> {task.dueDate?.split('T')[0]}
                    </div>
                    <div 
                      className="status-badge"
                      style={{ background: getStatusColor(task.status) }}
                    >
                      {getStatusIcon(task.status)} {task.status}
                    </div>
                  </div>

                  <label className="form-label small" style={{ color: '#a8a8ff', fontWeight: '500' }}>
                    Update Status:
                  </label>
                  <select
                    className="form-select mb-3"
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                  >
                    <option value="To Do">📋 To Do</option>
                    <option value="In Progress">🔄 In Progress</option>
                    <option value="Done">✅ Done</option>
                  </select>

                  <div className="comment-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add a comment and press Enter..."
                      value={commentInput[task._id] || ''}
                      onChange={(e) => handleCommentChange(task._id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') submitComment(task._id);
                      }}
                    />
                  </div>

                  {task.comments?.length > 0 && (
                    <ul className="comments-list">
                      {task.comments.map((c, index) => (
                        <li key={index} className="comment-item">
                          {c.text}
                          <div className="comment-timestamp">
                            {new Date(c.createdAt).toLocaleString()}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {isPlanModalOpen && (
        <div className="ai-modal-overlay" onClick={() => setIsPlanModalOpen(false)}>
          <div className="ai-modal-content" onClick={e => e.stopPropagation()}>
            <h4>🤖 Your AI-Generated Daily Plan</h4>
            {isLoadingPlan ? (
              <div className="loading-spinner"></div>
            ) : (
              <ReactMarkdown>{planText}</ReactMarkdown>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MemberDashboard;