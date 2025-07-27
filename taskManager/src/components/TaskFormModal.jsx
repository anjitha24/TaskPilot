import React, { useState, useEffect } from 'react';

const TaskFormModal = ({ taskToEdit, members, projects, onClose, onSave }) => {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', assignedTo: '', project: '' });

  useEffect(() => {
    if (taskToEdit) {
      setForm({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        dueDate: taskToEdit.dueDate?.split('T')[0] || '',
        assignedTo: taskToEdit.assignedTo?._id || '',
        project: taskToEdit.project?._id || ''
      });
    } else {
      setForm({ title: '', description: '', dueDate: '', assignedTo: '', project: '' });
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form, taskToEdit?._id);
  };

  const modalStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1050
  };

  const modalContentStyle = {
    background: '#1a1a2e', padding: '30px', borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.1)', width: '100%', maxWidth: '500px',
    color: 'white'
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <h4 style={{textAlign: 'center', marginBottom: '20px'}}>
          {taskToEdit ? '✏️ Edit Task' : '➕ Create New Task'}
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Task Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="form-control" required
            />
          </div>
          <div className="mb-2">
            <textarea
              placeholder="Task Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="form-control" rows="3"
            />
          </div>
          <div className="mb-2">
            <label className="form-label small ms-2" style={{color: 'rgba(255,255,255,0.7)'}}>Due Date:</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="form-control" required
            />
          </div>
          <div className="mb-2">
             <select
              className="form-select"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              required
            >
              <option value="">👤 Assign To Member</option>
              {members.map(member => (
                <option key={member._id} value={member._id}>{member.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <select
              className="form-select"
              value={form.project}
              onChange={(e) => setForm({ ...form, project: e.target.value })}
              required
            >
              <option value="">📁 Assign To Project</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>{project.title}</option>
              ))}
            </select>
          </div>
          <div className="d-flex justify-content-between gap-3 pt-2">
            <button type="button" className="btn btn-secondary w-100" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-success w-100">{taskToEdit ? 'Update Task' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;