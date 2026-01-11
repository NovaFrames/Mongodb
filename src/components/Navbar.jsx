import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Chip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const Navbar = ({ isLoggedIn, setIsLoggedIn, credits, setCredits }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('credits');
        setIsLoggedIn(false);
        if (setCredits) setCredits(null);
        navigate('/login');
    };

    return (
        <AppBar position="fixed" color="inherit" elevation={0} sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            zIndex: (theme) => theme.zIndex.drawer + 1
        }}>
            <Box sx={{ px: 3 }}>
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            fontWeight: 900,
                            letterSpacing: '-0.5px',
                            color: 'primary.main',
                            textDecoration: 'none',
                        }}
                    >
                        ARCONE
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        {isLoggedIn && credits !== null && (
                            <Chip
                                icon={<MonetizationOnIcon sx={{ color: '#fbbf24 !important' }} />}
                                label={`${credits} Credits`}
                                variant="outlined"
                                sx={{
                                    fontWeight: 700,
                                    borderColor: 'divider',
                                    bgcolor: 'rgba(251, 191, 36, 0.05)',
                                    color: 'text.primary'
                                }}
                            />
                        )}
                        {isLoggedIn ? (
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<LogoutIcon />}
                                onClick={handleLogout}
                                sx={{ borderColor: 'divider' }}
                            >
                                Logout
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                component={Link}
                                to="/login"
                                startIcon={<LoginIcon />}
                                disableElevation
                            >
                                Sign In
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Box>
        </AppBar>
    );
};

export default Navbar;
