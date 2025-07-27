import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUser, setRole }) => {
  const [form, setForm] = useState({ email: '', password: '', role: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    if (!form.email || !form.password || !form.role) {
      alert('Please fill all fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/users/login', form);
      const { token, user } = res.data;

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', user.name);
      localStorage.setItem('role', user.role);
      localStorage.setItem('email', user.email);
      localStorage.setItem('id', user._id);

      setUser(user.name);
      setRole(user.role);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="auth-container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 80px)',
      paddingTop: '80px'
    }}>
      <div className="auth-card" style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: 'white',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          Login to <span style={{ color: '#a8e6cf' }}>TaskPilot</span>
        </h3>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Role
          </label>
          <select
            name="role"
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            value={form.role}
            onChange={handleChange}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <option value="" style={{ background: '#333', color: 'white' }}>-- Select Role --</option>
            <option value="admin" style={{ background: '#333', color: 'white' }}>Admin</option>
            <option value="member" style={{ background: '#333', color: 'white' }}>Team Member</option>
          </select>
        </div>

        <button 
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
          }}
          onClick={handleLogin}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
          }}
        >
          Login
        </button>

        <p style={{ 
          textAlign: 'center',
          marginTop: '20px',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px'
        }}>
          Don't have an account? {' '}
          <Link 
            to="/register" 
            style={{ 
              color: '#a8e6cf',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;