import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AwardBadgeModal from '../../components/AwardBadgeModal';
import UserFormModal from '../../components/UserFormModal'; // Import the new form modal

const TeamPage = () => {
  const [team, setTeam] = useState([]);
  const [userToAward, setUserToAward] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchTeam = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/users', authHeader);
      setTeam(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch team:', err);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleSaveUser = async (formData, userId) => {
    try {
      if (userId) { // This is an update
        await axios.put(`http://localhost:8000/api/users/${userId}`, {
          name: formData.name, email: formData.email, role: formData.role
        }, authHeader);
      } else { // This is a new user
        await axios.post('http://localhost:8000/api/users', formData, authHeader);
      }
      setIsFormModalOpen(false);
      fetchTeam();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${id}`, authHeader);
        fetchTeam();
      } catch (err) {
        console.error('❌ Failed to delete user:', err);
      }
    }
  };

  const handleRemoveBadge = async (userId, badgeId) => {
    if (window.confirm('Are you sure you want to remove this badge?')) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${userId}/badges/${badgeId}`, authHeader);
        fetchTeam();
      } catch (err) {
        alert('Failed to remove badge.');
      }
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setIsFormModalOpen(true);
  };
  
  const openEditModal = (user) => {
    setEditingUser(user);
    setIsFormModalOpen(true);
  };

  return (
    <>
      <style>{`
        body { background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh; }
        .container { backdrop-filter: blur(25px); background: rgba(15, 15, 35, 0.4); border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px; margin: 30px auto; color: white; }
        .container h3 { color: #ffffff; text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5); font-weight: 700; margin-bottom: 0; background: linear-gradient(135deg, #ffffff 0%, #a8a8ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 2.2rem; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .btn-add-member { background: linear-gradient(135deg, #28a745 0%, #4caf50 100%) !important; border: none !important; border-radius: 15px !important; padding: 12px 24px !important; font-weight: 600 !important; color: white !important; }

        .user-card {
          backdrop-filter: blur(20px);
          background: rgba(15, 15, 35, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 20px !important;
          transition: all 0.4s ease !important;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .user-card:hover { transform: translateY(-8px) scale(1.03); box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3); }
        .user-card-header { padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .user-card-body { padding: 20px; flex-grow: 1; }
        .user-card-footer { padding: 15px 20px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: flex-end; gap: 10px; }
        
        .user-name { font-size: 1.3rem; font-weight: 600; margin-bottom: 5px; }
        .user-email { font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); }
        
        .role-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; }
        .role-admin { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); }
        .role-member { background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%); }

        .icon-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; transition: all 0.3s ease; }
        .icon-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.1); }
        
        .badge-section-title { font-size: 0.9rem; color: rgba(255,255,255,0.6); margin-bottom: 10px; font-weight: 500; }
        .badge-display { display: inline-flex; align-items: center; background-color: rgba(0,0,0,0.3); padding: 5px 10px; border-radius: 20px; margin-right: 10px; margin-bottom: 10px; font-size: 0.9rem; border: 1px solid rgba(255,255,255,0.1); }
        .badge-display-icon { width: 20px; height: 20px; margin-right: 8px; }
        .badge-remove-btn { background: #6c757d; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; margin-left: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; line-height: 20px; padding: 0; transition: background-color 0.2s; }
        .badge-remove-btn:hover { background: #dc3545; }
      `}</style>

      <div className="container mt-5">
        <div className="page-header">
          <h3>👥 Team Management</h3>
          <button className="btn btn-add-member" onClick={openAddModal}>＋ Add New Member</button>
        </div>

        <div className="row">
          {team.length === 0 ? (
            <div className="col-12 text-center mt-5">
              <p>No team members yet. Click "Add New Member" to get started!</p>
            </div>
          ) : (
            team.map((user) => (
              <div key={user._id} className="col-lg-4 col-md-6 mb-4">
                <div className="user-card">
                  <div className="user-card-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="user-name mb-0">{user.name}</h5>
                      <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-member'}`}>{user.role}</span>
                    </div>
                    <p className="user-email mb-0">{user.email}</p>
                  </div>
                  <div className="user-card-body">
                    <h6 className="badge-section-title">Earned Badges ({user.totalPoints || 0} pts)</h6>
                    {user.badges && user.badges.length > 0 ? (
                      <div>
                        {user.badges.map(badge => (
                          <span key={badge._id} className="badge-display" title={`${badge.name}: ${badge.description}`}>
                            <img src={badge.icon} alt={badge.name} className="badge-display-icon" />
                            {badge.name}
                            <button className="badge-remove-btn" onClick={() => handleRemoveBadge(user._id, badge._id)}>&times;</button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p style={{fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)'}}>No badges earned yet.</p>
                    )}
                  </div>
                  <div className="user-card-footer">
                    {user.role === 'member' && (
                      <button className="icon-btn" title="Award Badge" onClick={() => setUserToAward(user)}>🏆</button>
                    )}
                    <button className="icon-btn" title="Edit User" onClick={() => openEditModal(user)}>✏️</button>
                    <button className="icon-btn" title="Delete User" onClick={() => handleDelete(user._id)}>🗑️</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isFormModalOpen && (
        <UserFormModal 
            userToEdit={editingUser}
            onClose={() => setIsFormModalOpen(false)}
            onSave={handleSaveUser}
        />
      )}

      {userToAward && (
        <AwardBadgeModal 
            user={userToAward} 
            onClose={() => setUserToAward(null)} 
        />
      )}
    </>
  );
};

export default TeamPage;