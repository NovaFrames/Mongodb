import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            padding: '20px 0',
        }}>
            <div className="container glass-panel" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
            }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                    <span className="gradient-text">Nova</span>Prompt
                </Link>
                <div>
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--text-main)',
                                fontWeight: '500',
                                cursor: 'pointer',
                                padding: '8px 16px',
                                borderRadius: 'var(--radius-sm)'
                            }}>
                            Logout
                        </button>
                    ) : (
                        <Link to="/login">
                            <button style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-main)',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}>Sign In</button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
