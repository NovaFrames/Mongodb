import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://mongodb-gcau.onrender.com/api/auth/register', { username, email, password });
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
        <div className="container" style={{ paddingTop: '120px', maxWidth: '400px' }}>
            <div className="glass-panel" style={{ padding: '40px' }}>
                <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Create Account</h2>
                {error && <div style={{ color: '#ff4d4d', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                    <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>Sign Up</button>
                </form>
                <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
