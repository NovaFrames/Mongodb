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
    Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
            if (res.data.success) {
                navigate('/login');
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
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
                            Build your AI design workspace.
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: '1rem', maxWidth: 420 }}>
                            Create your studio account and unlock advanced rendering workflows built for modern teams.
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
                                { label: 'Dedicated studio', detail: 'Organize all projects in one place.' },
                                { label: 'Priority renders', detail: 'Faster turnaround on edits.' },
                                { label: 'Team ready', detail: 'Invite collaborators instantly.' },
                                { label: 'Usage insights', detail: 'Track credits per project.' },
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
                                Create account
                            </Typography>
                            <Typography color="text.secondary">
                                Start with your studio credentials.
                            </Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                        <form onSubmit={handleRegister}>
                            <TextField
                                fullWidth
                                label="Username"
                                variant="outlined"
                                margin="normal"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon color="action" />
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
                                label="Email Address"
                                type="email"
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
                                type="password"
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
                                Sign Up
                            </Button>
                        </form>

                        <Divider sx={{ my: 3, opacity: 0.4 }} />

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                Already have an account?{' '}
                                <Box
                                    component={Link}
                                    to="/login"
                                    sx={{
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    Sign in
                                </Box>
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default Register;
