import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    InputAdornment,
    IconButton,
    Divider
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const Login = ({ setIsLoggedIn, setCredits }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('username', res.data.user.username);
                if (typeof res.data.user.credits === 'number') {
                    localStorage.setItem('credits', String(res.data.user.credits));
                    setCredits(res.data.user.credits);
                }
                setIsLoggedIn(true);
                navigate('/');
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: { xs: 2, md: 6 },
                py: { xs: 6, md: 10 },
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'background.default',
                backgroundImage: `
                    radial-gradient(700px 400px at 10% 10%, rgba(212, 176, 76, 0.12), transparent 60%),
                    radial-gradient(500px 320px at 90% 20%, rgba(212, 176, 76, 0.18), transparent 55%),
                    linear-gradient(180deg, rgba(20, 30, 42, 0.9) 0%, rgba(10, 17, 24, 0.95) 100%)
                `,
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    opacity: 0.25,
                    pointerEvents: 'none',
                }}
            />
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
                        gap: { xs: 4, md: 6 },
                        alignItems: 'stretch',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: 3,
                            color: 'text.primary',
                            animation: 'fadeUp 0.8s ease-out',
                            '@keyframes fadeUp': {
                                from: { opacity: 0, transform: 'translateY(16px)' },
                                to: { opacity: 1, transform: 'translateY(0)' },
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2,
                                py: 0.8,
                                borderRadius: 999,
                                border: '1px solid rgba(212, 176, 76, 0.4)',
                                bgcolor: 'rgba(212, 176, 76, 0.08)',
                                width: 'fit-content',
                                letterSpacing: '0.08em',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                            }}
                        >
                            ArcOne Studio
                        </Box>
                        <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.05 }}>
                            Sign in to your design control room.
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: '1rem', maxWidth: 420 }}>
                            Manage your AI-powered workflows, credits, and projects in one sharp workspace built for architects.
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 2,
                                mt: 2,
                            }}
                        >
                            {[
                                { label: 'Realtime previews', detail: 'See edits before they render.' },
                                { label: 'Secure storage', detail: 'Keep assets in one vault.' },
                                { label: 'Credits control', detail: 'Track usage per render.' },
                                { label: 'Studio templates', detail: 'Save your best looks.' },
                            ].map((item) => (
                                <Box
                                    key={item.label}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        bgcolor: 'rgba(15, 23, 33, 0.65)',
                                        backdropFilter: 'blur(10px)',
                                        animation: 'floatUp 1.2s ease-out',
                                        '@keyframes floatUp': {
                                            from: { opacity: 0, transform: 'translateY(12px)' },
                                            to: { opacity: 1, transform: 'translateY(0)' },
                                        },
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{item.label}</Typography>
                                    <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                        {item.detail}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, sm: 4 },
                            borderRadius: 4,
                            border: '1px solid rgba(255,255,255,0.08)',
                            bgcolor: 'rgba(15, 23, 33, 0.8)',
                            backdropFilter: 'blur(18px)',
                            boxShadow: '0 24px 60px rgba(5, 10, 18, 0.6)',
                            alignSelf: 'center',
                            animation: 'fadeUp 0.9s ease-out',
                        }}
                    >
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                                Welcome back
                            </Typography>
                            <Typography color="text.secondary">
                                Enter your credentials to continue.
                            </Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                        <form onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                variant="outlined"
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'rgba(8, 14, 20, 0.8)',
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'rgba(8, 14, 20, 0.8)',
                                    },
                                }}
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    fontWeight: 700,
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    boxShadow: '0 14px 30px rgba(212, 176, 76, 0.3)',
                                    '&:hover': {
                                        bgcolor: 'primary.main',
                                        filter: 'brightness(1.05)',
                                    },
                                }}
                                disableElevation
                            >
                                Sign In
                            </Button>
                        </form>

                        <Divider sx={{ my: 3, opacity: 0.4 }} />

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                New here?{' '}
                                <Box
                                    component={Link}
                                    to="/register"
                                    sx={{
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    Create an account
                                </Box>
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;
