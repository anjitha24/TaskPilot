import React from 'react';
import { useNavigate } from 'react-router-dom';
import Aurora from '../components/Aurora';
import ShinyText from '../components/ShinyText';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="position-relative min-vh-100 overflow-hidden">



      {/* Main Content */}
      <div className="container mt-5 pt-5 text-center position-relative" style={{ zIndex: 10 }}>
        <h1 className="display-3 fw-bold mb-3 text-white">
          Welcome to{' '}
          <span style={{
            color: '#fff',
            fontFamily: '"Bitcount Grid Double", system-ui',
            fontOpticalSizing: 'auto',
            fontWeight: 300,
            fontStyle: 'normal',
            fontVariationSettings: '"slnt" 0, "CRSV" 0.5, "ELSH" 0, "ELXP" 0'
          }}>
            TaskPilot
          </span>
        </h1>

        <p className="lead fs-5 mb-4 text-white">
          Your all-in-one role-based task & project management dashboard.
        </p>

        <p className="lead fs-5 mb-4 text-white">
          Admins organize. Team Members execute. <br />
          Stay productive. Stay on track.
        </p>

        <p className="fs-6 mb-5 text-white">
          Click <strong>"Get Started"</strong> below to log in or register.
        </p>

        <button
          className="btn btn-lg mt-4 shadow-lg"
          onClick={handleGetStarted}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '15px',
            color: '#fff',
            fontWeight: '600',
            padding: '12px 32px',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            fontSize: '1.1rem',
            letterSpacing: '0.5px',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 40px rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.37)';
          }}
        >
          <ShinyText text="Get Started" disabled={false} speed={3} />
        </button>
      </div>
    </div>
  );
};

export default Home;