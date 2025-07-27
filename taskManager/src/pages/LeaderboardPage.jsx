import React, { useState, useEffect } from 'react';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/leaderboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data. Make sure you have created and awarded some badges first!');
        }

        const data = await response.json();
        setLeaderboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // This CSS is designed to match the dark theme of your dashboards
  const styles = `
    .leaderboard-container {
      max-width: 900px;
      margin: 40px auto;
      padding: 40px;
      color: white;
      font-family: 'Segoe UI', sans-serif;
      backdrop-filter: blur(25px);
      background: rgba(15, 15, 35, 0.4);
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .leaderboard-container h1 {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #ffffff 0%, #a8a8ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .leaderboard-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 2rem;
    }
    .leaderboard-table th, .leaderboard-table td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .leaderboard-table th {
      font-size: 1rem;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.7);
    }
    .leaderboard-table tbody tr:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
    .rank {
      font-size: 1.5rem;
      font-weight: 700;
      color: #a8a8ff;
    }
    .points {
      font-weight: 700;
      font-size: 1.2rem;
    }
    .badge-icon {
      width: 30px;
      height: 30px;
      margin-right: 8px;
      vertical-align: middle;
      transition: transform 0.2s;
    }
    .badge-icon:hover {
      transform: scale(1.2);
    }
  `;

  if (loading) return <p style={{ color: 'white', textAlign: 'center', fontSize: '1.2rem' }}>Loading Leaderboard...</p>;
  if (error) return <p style={{ color: '#ff4d4d', textAlign: 'center', fontSize: '1.2rem' }}>{error}</p>;

  return (
    <>
      <style>{styles}</style>
      <div className="leaderboard-container">
        <h1>🏆 Leaderboard</h1>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Member</th>
              <th style={{ textAlign: 'center' }}>Points</th>
              <th style={{ textAlign: 'center' }}>Badges</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={user._id}>
                <td className="rank">{index + 1}</td>
                <td>{user.name}</td>
                <td className="points" style={{ textAlign: 'center' }}>{user.totalPoints}</td>
                <td style={{ textAlign: 'center' }}>
                  {user.badges.map(badge => (
                    <img 
                      key={badge._id} 
                      src={badge.icon} 
                      alt={badge.name}
                      className="badge-icon"
                      title={`${badge.name}: ${badge.description} (+${badge.points} pts)`} 
                    />
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LeaderboardPage;