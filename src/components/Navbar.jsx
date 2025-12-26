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
            zIndex: 1100, // Above sidebar
            padding: '16px 0',
        }}>
            <div className="container">
                <div className="glass-panel" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 24px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                    <Link to="/" style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        letterSpacing: '-1px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.2rem'
                        }}>N</div>
                        <span className="gradient-text">Nova</span>Prompt
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="glass-panel"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--text-main)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    padding: '8px 20px',
                                    fontSize: '0.9rem',
                                    border: '1px solid var(--glass-border)',
                                    transition: 'var(--transition)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                            >
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <button
                                    className="glass-panel"
                                    style={{
                                        background: 'var(--primary)',
                                        border: 'none',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        padding: '8px 20px',
                                        boxShadow: '0 4px 15px var(--primary-glow)',
                                        transition: 'var(--transition)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
                                >
                                    Sign In
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
