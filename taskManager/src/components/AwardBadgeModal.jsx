import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AwardBadgeModal = ({ user, onClose }) => {
  const [badges, setBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState('');
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch all available badges when the modal opens
  useEffect(() => {
    axios.get('http://localhost:8000/api/badges', authHeader)
      .then(res => {
        setBadges(res.data);
        if (res.data.length > 0) {
          setSelectedBadge(res.data[0]._id); // Pre-select the first badge
        }
      })
      .catch(err => console.error("Failed to fetch badges", err));
  }, []);

  const handleAwardBadge = async (e) => {
    e.preventDefault();
    if (!selectedBadge) {
      alert('Please select a badge.');
      return;
    }
    try {
      await axios.post(`http://localhost:8000/api/users/${user._id}/award-badge`, { badgeId: selectedBadge }, authHeader);
      alert(`Badge awarded successfully to ${user.name}!`);
      onClose(); // Close the modal on success
    } catch (err) {
      alert('Error awarding badge. The user may already have it.');
      console.error(err);
    }
  };

  // Simple modal styling
  const modalStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
    justifyContent: 'center', alignItems: 'center'
  };

  const modalContentStyle = {
    background: '#1a1a2e', padding: '30px', borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.1)', minWidth: '400px',
    color: 'white'
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <h4 style={{textAlign: 'center', marginBottom: '20px'}}>Award Badge to {user.name}</h4>
        <form onSubmit={handleAwardBadge}>
          <select className="form-select mb-3" value={selectedBadge} onChange={e => setSelectedBadge(e.target.value)} required>
            {badges.map(badge => (
              <option key={badge._id} value={badge._id}>
                {badge.name} (+{badge.points} pts)
              </option>
            ))}
          </select>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <button type="submit" className="btn btn-success">Confirm Award</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AwardBadgeModal;