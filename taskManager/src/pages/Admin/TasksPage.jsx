import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskFormModal from '../../components/TaskFormModal'; // Import the new modal

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // State for the modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchTasks();
    fetchMembers();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/tasks', authHeader);
      setTasks(res.data);
    } catch (err) { console.error('Failed to fetch tasks', err); }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/users', authHeader);
      setMembers(res.data.filter(u => u.role === 'member'));
    } catch (err) { console.error('Failed to fetch users', err); }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/projects', authHeader);
      setProjects(res.data);
    } catch (err) { console.error('Failed to fetch projects', err); }
  };

  const handleSaveTask = async (formData, taskId) => {
    try {
      if (taskId) {
        await axios.put(`http://localhost:8000/api/tasks/${taskId}`, formData, authHeader);
        alert('✅ Task updated!');
      } else {
        await axios.post('http://localhost:8000/api/tasks', formData, authHeader);
        alert('✅ Task created!');
      }
      setIsFormModalOpen(false);
      fetchTasks();
    } catch (err) {
      alert('❌ Failed to save task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
        try {
            await axios.delete(`http://localhost:8000/api/tasks/${id}`, authHeader);
            fetchTasks();
        } catch (err) {
            alert('❌ Failed to delete task');
        }
    }
  };

  const openAddModal = () => {
    setEditingTask(null);
    setIsFormModalOpen(true);
  };
  
  const openEditModal = (task) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  };

  // Helper to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return '#28a745';
      case 'In Progress': return '#ffc107';
      case 'To Do':
      default: return '#1976d2';
    }
  };

  return (
    <>
      <style>{`
        body { background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh; }
        .container { backdrop-filter: blur(25px); background: rgba(15, 15, 35, 0.4); border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px; margin: 30px auto; color: white; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .page-header h3 { margin-bottom: 0; background: linear-gradient(135deg, #ffffff 0%, #a8a8ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 2.2rem; font-weight: 800; }
        .btn-add-task { background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%) !important; border: none !important; border-radius: 15px !important; padding: 12px 24px !important; font-weight: 600 !important; color: white !important; }

        .task-card {
          backdrop-filter: blur(20px); background: rgba(15, 15, 35, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important; border-radius: 20px !important;
          transition: all 0.4s ease !important; height: 100%; display: flex; flex-direction: column;
        }
        .task-card:hover { transform: translateY(-8px) scale(1.03); box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3); }
        .task-card-body { padding: 25px; flex-grow: 1; }
        .task-card-footer { padding: 15px 25px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: flex-end; gap: 10px; }
        
        .task-title { font-size: 1.3rem; font-weight: 600; margin-bottom: 10px; color: #fff; }
        .task-meta { font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); margin-bottom: 15px; }
        .task-meta span { margin-right: 15px; }
        .task-status {
          display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem;
          color: white; font-weight: 500;
        }
        .icon-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; transition: all 0.3s ease; }
        .icon-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.1); }
      `}</style>

      <div className="container mt-5">
        <div className="page-header">
          <h3>📋 Manage Tasks</h3>
          <button className="btn btn-add-task" onClick={openAddModal}>➕ Add New Task</button>
        </div>

        <div className="row">
          {tasks.length === 0 ? (
            <div className="col-12 text-center mt-5"><p>No tasks yet. Click "Add New Task" to get started!</p></div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="col-lg-4 col-md-6 mb-4">
                <div className="task-card">
                  <div className="task-card-body">
                    <div className="d-flex justify-content-between align-items-start">
                        <h5 className="task-title">{task.title}</h5>
                        <span className="task-status" style={{ backgroundColor: getStatusColor(task.status) }}>
                            {task.status}
                        </span>
                    </div>
                    <p className="task-meta">
                      <span>📁 {task.project?.title || 'N/A'}</span>
                      <span>👤 {task.assignedTo?.name || 'N/A'}</span>
                    </p>
                    <p className="project-dates">
                      <strong>Due:</strong> {task.dueDate?.slice(0, 10) || 'Not set'}
                    </p>
                  </div>
                  <div className="task-card-footer">
                    <button className="icon-btn" title="Edit Task" onClick={() => openEditModal(task)}>✏️</button>
                    <button className="icon-btn" title="Delete Task" onClick={() => handleDelete(task._id)}>🗑️</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isFormModalOpen && (
        <TaskFormModal 
            taskToEdit={editingTask}
            members={members}
            projects={projects}
            onClose={() => setIsFormModalOpen(false)}
            onSave={handleSaveTask}
        />
      )}
    </>
  );
};

export default TasksPage;