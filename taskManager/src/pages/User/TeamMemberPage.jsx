import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeamMemberPage = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [commentInput, setCommentInput] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/tasks/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch tasks:", err);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks(); // Refresh list
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    }
  };

  const handleCommentChange = (taskId, text) => {
    setCommentInput(prev => ({ ...prev, [taskId]: text }));
  };

  const submitComment = async (taskId) => {
    if (!commentInput[taskId]) return;
    try {
      await axios.post(
        `http://localhost:8000/api/tasks/${taskId}/comment`,
        { text: commentInput[taskId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentInput(prev => ({ ...prev, [taskId]: '' }));
      fetchTasks(); // Refresh
    } catch (err) {
      console.error("❌ Failed to submit comment:", err);
    }
  };

  const filteredTasks = tasks.filter(t =>
    (!statusFilter || t.status === statusFilter) &&
    (!projectFilter || t.project?.title === projectFilter)
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🧑‍💻 Team Member Dashboard</h2>

      {/* ✅ Project Overview */}
      <h4>📌 Project Overview</h4>
      {[...new Set(tasks.map(t => t.project?.title))].map((project, index) => (
        <div key={index} className="card p-2 my-2">
          <h5>📁 {project}</h5>
          <p>Total Tasks: {tasks.filter(t => t.project?.title === project).length}</p>
          <p>Completed: {tasks.filter(t => t.project?.title === project && t.status === "Done").length}</p>
        </div>
      ))}

      {/* ✅ Filters */}
      <div className="d-flex gap-3 mb-4 mt-4">
        <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <select className="form-select" value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
          <option value="">All Projects</option>
          {[...new Set(tasks.map(t => t.project?.title))].map((title, i) => (
            <option key={i} value={title}>{title}</option>
          ))}
        </select>
      </div>

      {/* ✅ Task Table */}
      {filteredTasks.length === 0 ? (
        <p>No tasks match the selected filters.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Status</th>
              <th>Change Status</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.project?.title || 'N/A'}</td>
                <td>
                  <span className={`badge ${
                    task.status === 'Done'
                      ? 'bg-success'
                      : task.status === 'In Progress'
                      ? 'bg-warning text-dark'
                      : 'bg-secondary'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td>
                  <select
                    className="form-select"
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="💬 Add comment"
                    value={commentInput[task._id] || ''}
                    onChange={(e) => handleCommentChange(task._id, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitComment(task._id)}
                  />
                  <ul className="mt-2">
                    {task.comments?.map((c, idx) => (
                      <li key={idx}>
                        💬 {c.text} <small className="text-muted">({new Date(c.createdAt).toLocaleString()})</small>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeamMemberPage;
