import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://mongodb-gcau.onrender.com/api/auth/login', { email, password });
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('username', res.data.user.username);
                setIsLoggedIn(true);
                navigate('/');
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="container" style={{ paddingTop: '120px', maxWidth: '400px' }}>
            <div className="glass-panel" style={{ padding: '40px' }}>
                <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Welcome Back</h2>
                {error && <div style={{ color: '#ff4d4d', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            padding: '12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(0,0,0,0.3)',
                            color: 'white',
                            outline: 'none'
                        }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            padding: '12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(0,0,0,0.3)',
                            color: 'white',
                            outline: 'none'
                        }}
                        required
                    />
                    <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>Sign In</button>
                </form>
                <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
