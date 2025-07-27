import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import ProjectFormModal from '../../components/ProjectFormModal'; // We created this in the last step

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // State for the AI Insights Modal
  const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
  const [insights, setInsights] = useState('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [currentProjectTitle, setCurrentProjectTitle] = useState('');

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/projects', authHeader);
      setProjects(res.data);
    } catch (err) { console.error('❌ Error fetching projects:', err); }
  };

  const handleSaveProject = async (formData, projectId) => {
    try {
      if (projectId) {
        await axios.put(`http://localhost:8000/api/projects/${projectId}`, formData, authHeader);
      } else {
        await axios.post('http://localhost:8000/api/projects', formData, authHeader);
      }
      setIsFormModalOpen(false);
      fetchProjects();
    } catch (err) {
      alert('Error saving project');
      console.error('❌ Error saving project:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
        try {
            await axios.delete(`http://localhost:8000/api/projects/${id}`, authHeader);
            fetchProjects();
        } catch (err) { console.error('❌ Error deleting project:', err); }
    }
  };

  const handleGetInsights = async (project) => {
    setCurrentProjectTitle(project.title);
    setIsLoadingInsights(true);
    setIsInsightsModalOpen(true);
    setInsights('');
    try {
      const res = await axios.post(`http://localhost:8000/api/projects/${project._id}/insights`, {}, authHeader);
      setInsights(res.data.insights);
    } catch (err) {
      setInsights('Sorry, there was an error generating insights for this project.');
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setIsFormModalOpen(true);
  };
  
  const openEditModal = (project) => {
    setEditingProject(project);
    setIsFormModalOpen(true);
  };

  return (
    <>
      <style>{`
        body { background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh; font-family: 'Segoe UI', sans-serif; }
        .container { backdrop-filter: blur(25px); background: rgba(15, 15, 35, 0.4); border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px; margin: 30px auto; color: white; }
        .container h3 { color: #ffffff; text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5); font-weight: 700; margin-bottom: 0; background: linear-gradient(135deg, #ffffff 0%, #a8a8ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 2.2rem; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .btn-add-project { background: linear-gradient(135deg, #28a745 0%, #4caf50 100%) !important; border: none !important; border-radius: 15px !important; padding: 12px 24px !important; font-weight: 600 !important; color: white !important; }
        
        .project-card {
          backdrop-filter: blur(20px); background: rgba(15, 15, 35, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important; border-radius: 20px !important;
          transition: all 0.4s ease !important; height: 100%; display: flex; flex-direction: column;
        }
        .project-card:hover { transform: translateY(-8px) scale(1.03); box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3); }
        .project-card-body { padding: 25px; flex-grow: 1; }
        .project-card-footer { padding: 15px 25px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: flex-end; gap: 10px; }
        
        .project-title { font-size: 1.4rem; font-weight: 600; margin-bottom: 10px; color: #fff; }
        .project-description { font-size: 0.95rem; color: rgba(255, 255, 255, 0.7); margin-bottom: 15px; }
        .project-dates { font-size: 0.85rem; color: rgba(255, 255, 255, 0.5); }
        
        .icon-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; transition: all 0.3s ease; }
        .icon-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.1); }
        .btn-ai-icon { background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%); }

        .ai-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 1050; }
        .ai-modal-content { background: #1a1a2e; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 15px; padding: 30px; color: white; width: 90%; max-width: 700px; max-height: 80vh; overflow-y: auto; }
        .ai-modal-content h4 { margin-top: 0; }
        .ai-modal-content strong { color: #a8a8ff; }
        .ai-modal-content ul { padding-left: 20px; }
        .ai-modal-content li { margin-bottom: 10px; }
        .loading-spinner { border: 4px solid rgba(255,255,255,0.2); border-top: 4px solid #a8a8ff; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 40px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

      <div className="container mt-5">
        <div className="page-header">
          <h3>📂 Projects</h3>
          <button className="btn btn-add-project" onClick={openAddModal}>➕ Create New Project</button>
        </div>

        <div className="row">
          {projects.length === 0 ? (
            <div className="col-12 text-center mt-5"><p>No projects yet. Click "Create New Project" to get started!</p></div>
          ) : (
            projects.map((proj) => (
              <div key={proj._id} className="col-lg-4 col-md-6 mb-4">
                <div className="project-card">
                  <div className="project-card-body">
                    <h5 className="project-title">{proj.title}</h5>
                    <p className="project-description">{proj.description}</p>
                    <p className="project-dates">
                      📅 {proj.startDate?.slice(0, 10)} to {proj.endDate?.slice(0, 10)}
                    </p>
                  </div>
                  <div className="project-card-footer">
                    <button className="icon-btn btn-ai-icon" title="Get Gemini Insights" onClick={() => handleGetInsights(proj)}>🚀</button>
                    <button className="icon-btn" title="Edit Project" onClick={() => openEditModal(proj)}>✏️</button>
                    <button className="icon-btn" title="Delete Project" onClick={() => handleDelete(proj._id)}>🗑️</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isFormModalOpen && (
        <ProjectFormModal 
          projectToEdit={editingProject}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveProject}
        />
      )}

      {isInsightsModalOpen && (
        <div className="ai-modal-overlay" onClick={() => setIsInsightsModalOpen(false)}>
          <div className="ai-modal-content" onClick={e => e.stopPropagation()}>
            <h4 className="mb-3">✨ AI Insights for "{currentProjectTitle}"</h4>
            {isLoadingInsights ? (
              <div className="loading-spinner"></div>
            ) : (
              <ReactMarkdown>{insights}</ReactMarkdown>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectsPage;