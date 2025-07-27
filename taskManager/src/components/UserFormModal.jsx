import React, { useState, useEffect } from 'react';

const UserFormModal = ({ userToEdit, onClose, onSave }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });

  // If we are editing a user, pre-fill the form with their data
  useEffect(() => {
    if (userToEdit) {
      setForm({ name: userToEdit.name, email: userToEdit.email, password: '', role: userToEdit.role });
    } else {
      setForm({ name: '', email: '', password: '', role: 'member' });
    }
  }, [userToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form, userToEdit?._id);
  };

  // Simple modal styling
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
          {userToEdit ? '✏️ Edit Team Member' : '👥 Add Team Member'}
        </h4>
        <form onSubmit={handleSubmit}>
          <input type="text" className="form-control mb-2" placeholder="Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="email" className="form-control mb-2" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          {!userToEdit && (
            <input type="password" className="form-control mb-2" placeholder="Password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          )}
          <select className="form-select mb-3" value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="member">Team Member</option>
            <option value="admin">Admin</option>
          </select>
          <div style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
            <button type="button" className="btn btn-secondary w-100" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-success w-100">{userToEdit ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;