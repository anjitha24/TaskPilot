import React, { useState, useEffect } from 'react';

const ProjectFormModal = ({ projectToEdit, onClose, onSave }) => {
  const [form, setForm] = useState({ title: '', description: '', startDate: '', endDate: '' });

  useEffect(() => {
    if (projectToEdit) {
      setForm({
        title: projectToEdit.title,
        description: projectToEdit.description,
        startDate: projectToEdit.startDate?.split('T')[0] || '',
        endDate: projectToEdit.endDate?.split('T')[0] || ''
      });
    } else {
      setForm({ title: '', description: '', startDate: '', endDate: '' });
    }
  }, [projectToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form, projectToEdit?._id);
  };

  return (
    <>
      <style>{`
        .project-form-modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(5px);
          display: flex; justify-content: center; align-items: center; z-index: 1050;
          animation: fadeIn 0.3s ease;
        }
        .project-form-modal-content {
          backdrop-filter: blur(20px);
          background: rgba(15, 15, 35, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 20px !important;
          padding: 30px 35px; color: white;
          width: 100%; max-width: 500px;
          animation: slideInUp 0.4s ease;
        }
        .project-form-modal-content h4 {
          text-align: center;
          color: #ffffff;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
          font-weight: 700;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #ffffff 0%, #a8a8ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .project-form-modal-content .form-label {
          color: rgba(255,255,255,0.7);
          margin-left: 5px;
          margin-bottom: 5px;
          font-size: 0.9rem;
        }
        .project-form-modal-content .form-control {
          backdrop-filter: blur(20px);
          background: rgba(15, 15, 35, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 15px !important;
          color: white !important;
          padding: 15px 20px !important;
        }
        .project-form-modal-content .btn {
          border-radius: 15px !important;
          padding: 12px 24px !important;
          font-weight: 600 !important;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
      <div className="project-form-modal-overlay" onClick={onClose}>
        <div className="project-form-modal-content" onClick={e => e.stopPropagation()}>
          <h4>
            {projectToEdit ? '✏️ Edit Project' : '➕ Create New Project'}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Project Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="form-control"
                rows="3"
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Start Date:</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">End Date:</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>
            <div className="d-flex justify-content-between gap-3 pt-3">
              <button type="button" className="btn btn-secondary w-100" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-success w-100">{projectToEdit ? 'Update Project' : 'Create Project'}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProjectFormModal;