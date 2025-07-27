// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';

// const Register = ({ setUser, setRole }) => {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: '',
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleRegister = async () => {
//     if (!form.name || !form.email || !form.password || !form.role) {
//       alert('Please fill all fields');
//       return;
//     }

//     try {
 

// const res = await axios.post('http://localhost:8000/api/users/register', form);

// // OR safer:
// const { token,user } = res.data;

// localStorage.setItem('token', token);
// localStorage.setItem('user', user.name);
// localStorage.setItem('role', user.role);
// localStorage.setItem('id', user._id);
// localStorage.setItem('email', user.email);

// setUser(user.name);
// setRole(user.role);
// navigate('/dashboard');




//     } catch (err) {
//       alert('Registration failed: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   return (
//     <div className="auth-wrapper">
//       <div className="auth-card">
//         <h3 className="text-center mb-4">📝 Register for <span className="text-primary">TaskPilot</span></h3>

//         <div className="mb-3">
//           <label>Name</label>
//           <input
//             type="text"
//             name="name"
//             className="form-control"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="Enter your name"
//           />
//         </div>

//         <div className="mb-3">
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             className="form-control"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="Enter your email"
//           />
//         </div>

//         <div className="mb-3">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             className="form-control"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="Enter your password"
//           />
//         </div>

//         <div className="mb-4">
//           <label>Role</label>
//           <select
//             className="form-select"
//             name="role"
//             value={form.role}
//             onChange={handleChange}
//           >
//             <option value="">-- Select Role --</option>
//             <option value="admin">Admin</option>
//             <option value="member">Team Member</option>
//           </select>
//         </div>

//         <button className="btn btn-success w-100" onClick={handleRegister}>
//           Register
//         </button>

//         <p className="text-center mt-3">
//           Already have an account? <Link to="/login">Login here</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = ({ setUser, setRole }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.role) {
      alert('Please fill all fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/users/register', form);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', user.name);
      localStorage.setItem('role', user.role);
      localStorage.setItem('id', user._id);
      localStorage.setItem('email', user.email);

      setUser(user.name);
      setRole(user.role);
      navigate('/dashboard');
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
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
          Register for <span style={{ color: '#a8e6cf' }}>TaskPilot</span>
        </h3>

        {/* Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            style={inputStyle}
          />
        </div>

        {/* Email */}
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
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={inputStyle}
          />
        </div>

        {/* Password */}
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
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            style={inputStyle}
          />
        </div>

        {/* Role */}
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
            value={form.role}
            onChange={handleChange}
            style={inputStyle}
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
          onClick={handleRegister}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
          }}
        >
          Register
        </button>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px'
        }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#a8e6cf',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

// Input styling reused
const inputStyle = {
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
};

export default Register;
