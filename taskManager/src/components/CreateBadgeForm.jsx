import React, { useState } from 'react';
import axios from 'axios';

const CreateBadgeForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [points, setPoints] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBadge = { name, description, icon, points: Number(points) };
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:8000/api/badges', newBadge, authHeader);
      alert('Badge created successfully!');
      // Clear the form
      setName('');
      setDescription('');
      setIcon('');
      setPoints('');
    } catch (err) {
      alert('Error creating badge.');
      console.error(err);
    }
  };

  return (
    <>
      <style>{`
        .badge-form-card {
          backdrop-filter: blur(20px);
          background: rgba(15, 15, 35, 0.7) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 25px !important;
          color: white;
          /* ✅ REMOVED: height: 100%; */
        }
        .badge-form-card .card-body {
          padding: 2rem;
        }
        .badge-form-card .card-title {
          color: #ffffff;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
          font-weight: 700;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #ffffff 0%, #a8a8ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .badge-form-card .form-control {
          backdrop-filter: blur(20px);
          background: rgba(15, 15, 35, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 15px !important;
          color: white !important;
          padding: 15px 20px !important;
          font-size: 1rem !important;
          transition: all 0.3s ease !important;
        }
        .badge-form-card .form-control::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .badge-form-card .form-control:focus {
          background: rgba(15, 15, 35, 0.8) !important;
          border-color: rgba(168, 168, 255, 0.5) !important;
          box-shadow: 0 0 0 0.2rem rgba(168, 168, 255, 0.25) !important;
          outline: none !important;
        }
        .badge-form-card .btn-primary {
          background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%) !important;
          border: none !important;
          border-radius: 15px !important;
          padding: 15px 30px !important;
          font-weight: 600 !important;
          font-size: 1.1rem !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 8px 20px rgba(25, 118, 210, 0.3) !important;
        }
        .badge-form-card .btn-primary:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 12px 30px rgba(25, 118, 210, 0.4) !important;
        }
      `}</style>
      <div className="badge-form-card">
        <div className="card-body">
          <h4 className="card-title">🎨 Create New Badge</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <input type="text" className="form-control" placeholder="Badge Name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="mb-2">
              <input type="text" className="form-control" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div className="mb-2">
              <input type="text" className="form-control" placeholder="Icon URL (e.g., /icons/star.png)" value={icon} onChange={e => setIcon(e.target.value)} required />
            </div>
            <div className="mb-3">
              <input type="number" className="form-control" placeholder="Points" value={points} onChange={e => setPoints(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Create Badge</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateBadgeForm;