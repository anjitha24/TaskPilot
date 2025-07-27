import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/notifications', authHeader);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const handleMarkAsRead = async () => {
    if (unreadCount === 0) return; // Don't do anything if no unread messages
    try {
      await axios.post('http://localhost:8000/api/notifications/mark-read', {}, authHeader);
      // Update the state to reflect that all are now read
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.link) {
      navigate(notification.link);
    }
    setIsOpen(false);
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <style>{`
        .notification-container { position: relative; display: inline-block; }
        .notification-bell {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          width: 42px; height: 42px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          position: relative;
          transition: all 0.3s ease;
        }
        .notification-bell:hover { background: rgba(255, 255, 255, 0.2); }
        .notification-badge {
          position: absolute; top: -5px; right: -5px;
          background-color: #dc3545;
          color: white;
          border-radius: 50%;
          width: 22px; height: 22px;
          font-size: 12px;
          font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #1a1a2e;
        }
        .notification-dropdown {
          position: absolute; top: 55px; right: 0;
          width: 350px;
          max-height: 400px;
          overflow-y: auto;
          background: #1a1a2e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          z-index: 1001;
          animation: fadeIn 0.3s ease;
        }
        .notification-item {
          padding: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .notification-item:hover { background-color: rgba(255, 255, 255, 0.05); }
        .notification-item.unread { background-color: rgba(66, 165, 245, 0.1); }
        .notification-item:last-child { border-bottom: none; }
        .notification-message { color: white; font-size: 0.95rem; margin: 0; }
        .notification-sender { font-size: 0.8rem; color: rgba(255, 255, 255, 0.6); }
        .no-notifications { padding: 40px 20px; text-align: center; color: rgba(255, 255, 255, 0.5); }
      `}</style>
      <div className="notification-container">
        <button 
          className="notification-bell" 
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) { // If we are opening the dropdown
                handleMarkAsRead();
            }
          }}
        >
          <span>🔔</span>
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>
        {isOpen && (
          <div className="notification-dropdown">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <div 
                  key={notif._id} 
                  className={`notification-item ${!notif.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <p className="notification-message">{notif.message}</p>
                  <span className="notification-sender">
                    from {notif.sender.name} - {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-notifications">You have no notifications yet.</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;