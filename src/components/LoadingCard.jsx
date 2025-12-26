import React from 'react';

const LoadingCard = () => {
    return (
        <div className="glass-panel" style={{
            overflow: 'hidden',
            marginBottom: '24px',
            breakInside: 'avoid',
            position: 'relative',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <div style={{
                width: '100%',
                height: '240px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite linear',
            }} />
            <div style={{ padding: '16px', flex: 1 }}>
                <div style={{
                    height: '16px',
                    width: '80%',
                    background: 'rgba(255,255,255,0.1)',
                    marginBottom: '12px',
                    borderRadius: '4px',
                    animation: 'shimmer 1.5s infinite linear',
                }} />
                <div style={{
                    height: '12px',
                    width: '60%',
                    background: 'rgba(255,255,255,0.05)',
                    marginBottom: '12px',
                    borderRadius: '4px',
                    animation: 'shimmer 1.5s infinite linear',
                }} />
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 'auto'
                }}>
                    <div style={{ height: '10px', width: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }} />
                    <div style={{ height: '10px', width: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }} />
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>

            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                color: 'var(--text-main)',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
                <div className="spinner" />
                <span style={{ fontSize: '0.9rem', fontWeight: '500', letterSpacing: '1px' }}>DREAMING...</span>
            </div>

            <style>{`
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-top: 3px solid var(--primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LoadingCard;
