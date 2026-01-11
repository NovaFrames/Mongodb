import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MOT from './pages/MOT';

import Sidebar from './components/Sidebar';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Support from './pages/Support';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D4B04C',
      contrastText: '#0A0A0A',
    },
    secondary: {
      main: '#4B4B4B',
    },
    background: {
      default: '#0A0A0A',
      paper: '#141414',
    },
    text: {
      primary: '#F1EEE7',
      secondary: '#9A9A9A',
    },
    divider: 'rgba(241, 238, 231, 0.08)',
  },
  typography: {
    fontFamily: '"DM Sans", "Inter", "Outfit", "Roboto", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h4: { fontWeight: 800, color: '#D4B04C' },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.02em' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `
            radial-gradient(800px 420px at 12% 8%, rgba(212, 176, 76, 0.12), transparent 60%),
            radial-gradient(700px 380px at 88% 12%, rgba(212, 176, 76, 0.06), transparent 60%)
          `,
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#0A0A0A',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0A0A0A',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        },
      },
    },
  },
});

import AppDetail from './pages/AppDetail';

const AppLayout = ({ isLoggedIn, setIsLoggedIn, credits, setCredits }) => {
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {!isLoggedIn && !hideHeader && (
        <Navbar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          credits={credits}
          setCredits={setCredits}
        />
      )}

      {isLoggedIn && <Sidebar setIsLoggedIn={setIsLoggedIn} />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isLoggedIn ? { sm: `calc(100% - 260px)` } : '100%',
          minHeight: '100vh',
          bgcolor: 'background.default',
          pt: !isLoggedIn && !hideHeader ? 8 : 0 // Only add padding if Navbar is visible
        }}
      >
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} credits={credits} />} />
          <Route path="/app/:id" element={isLoggedIn ? <AppDetail /> : <Home isLoggedIn={false} />} />
          <Route path="/mot" element={isLoggedIn ? <MOT /> : <Home isLoggedIn={false} />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Home isLoggedIn={false} />} />
          <Route path="/settings" element={isLoggedIn ? <Settings /> : <Home isLoggedIn={false} />} />
          <Route path="/support" element={isLoggedIn ? <Support /> : <Home isLoggedIn={false} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setCredits={setCredits} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    const storedCredits = localStorage.getItem('credits');
    if (storedCredits !== null) {
      setCredits(Number(storedCredits));
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppLayout
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          credits={credits}
          setCredits={setCredits}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
