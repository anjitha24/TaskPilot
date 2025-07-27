import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BadgeManager = () => {
  // State for the "Create Badge" form
  const [badgeName, setBadgeName] = useState('');
  const [badgeDesc, setBadgeDesc] = useState('');
  const [badgeIcon, setBadgeIcon] = useState('');
  const [badgePoints, setBadgePoints] = useState(0);

  // State for the "Award Badge" form
  const [users, setUsers] = useState([]);
  const [badges, setBadges] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('');

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch users and badges when the component loads
  useEffect(() => {
    axios.get('http://localhost:8000/api/users', authHeader).then(res => setUsers(res.data));
    axios.get('http://localhost:8000/api/badges', authHeader).then(res => setBadges(res.data));
  }, []);

  const handleCreateBadge = async (e) => {
    e.preventDefault();
    try {
      const newBadge = { name: badgeName, description: badgeDesc, icon: badgeIcon, points: badgePoints };
      await axios.post('http://localhost:8000/api/badges', newBadge, authHeader);
      alert('Badge created successfully!');
      // Refresh badge list
      axios.get('http://localhost:8000/api/badges', authHeader).then(res => setBadges(res.data));
    } catch (err) {
      alert('Error creating badge.');
      console.error(err);
    }
  };

  const handleAwardBadge = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedBadge) {
        alert('Please select a user and a badge.');
        return;
    }
    try {
      await axios.post(`http://localhost:8000/api/users/${selectedUser}/award-badge`, { badgeId: selectedBadge }, authHeader);
      alert('Badge awarded successfully!');
    } catch (err) {
      alert('Error awarding badge. The user may already have it.');
      console.error(err);
    }
  };

  return (
    <div className="row mt-4">
      {/* Create Badge Form */}
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title" style={{ color: 'white' }}>Create New Badge</h4>
            <form onSubmit={handleCreateBadge}>
              <input type="text" className="form-control mb-2" placeholder="Badge Name (e.g., Team Player)" onChange={e => setBadgeName(e.target.value)} required />
              <input type="text" className="form-control mb-2" placeholder="Description" onChange={e => setBadgeDesc(e.target.value)} required />
              <input type="text" className="form-control mb-2" placeholder="Icon URL (e.g., /icons/star.png)" onChange={e => setBadgeIcon(e.target.value)} required />
              <input type="number" className="form-control mb-3" placeholder="Points (e.g., 50)" onChange={e => setBadgePoints(e.target.value)} required />
              <button type="submit" className="btn btn-primary">Create Badge</button>
            </form>
          </div>
        </div>
      </div>

      {/* Award Badge Form */}
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title" style={{ color: 'white' }}>Award Badge to Member</h4>
            <form onSubmit={handleAwardBadge}>
              <select className="form-select mb-2" value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
                <option value="">Select a User...</option>
                {users.filter(u => u.role === 'member').map(user => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
              <select className="form-select mb-3" value={selectedBadge} onChange={e => setSelectedBadge(e.target.value)} required>
                <option value="">Select a Badge...</option>
                {badges.map(badge => (
                  <option key={badge._id} value={badge._id}>{badge.name} (+{badge.points} pts)</option>
                ))}
              </select>
              <button type="submit" className="btn btn-success">Award Badge</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeManager;