import React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Notifications from './Notifications'; // ✅ ADDED: Import the new component

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  webkitBackdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  borderRadius: 25,
  padding: '8px 24px',
  marginLeft: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '1rem',
  background: 'rgba(255, 255, 255, 0.1)',
}));

const LogoTypography = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  color: '#fff',
  fontWeight: 300,
  fontSize: '1.5rem',
  fontFamily: '"Bitcount Grid Double", system-ui', // Assuming you have this font
}));

const Navbar = ({ role, setRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the user's role and token from storage
    localStorage.removeItem('userRole');
    localStorage.removeItem('token'); // Also remove the token
    localStorage.removeItem('role'); // Also remove the role
    setRole(null); // Update the state in App.jsx
    navigate('/'); // Navigate back to home
    window.location.reload(); // Force a reload to clear all states
  };

  return (
    <GlassAppBar position="fixed" elevation={0}>
      <Toolbar>
        <LogoTypography variant="h6">
          TaskPilot
        </LogoTypography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {role ? (
            <>
              {/* ✅ ADDED: Notification Bell */}
              <Box sx={{ marginRight: '10px' }}>
                <Notifications />
              </Box>

              <NavButton onClick={() => navigate('/dashboard')}>
                Dashboard
              </NavButton>

              <NavButton onClick={() => navigate('/leaderboard')}>
                🏆 Leaderboard
              </NavButton>

              <NavButton onClick={handleLogout}>
                Logout
              </NavButton>
            </>
          ) : (
            <>
              {/* Show these buttons if NO role exists (user is logged out) */}
              <NavButton onClick={() => navigate('/login')}>
                Login
              </NavButton>
              <NavButton onClick={() => navigate('/register')}>
                Register
              </NavButton>
            </>
          )}
        </Box>
      </Toolbar>
    </GlassAppBar>
  );
};

export default Navbar;