import React from 'react';

const TextLoader = () => {
    return (
        <div style={{
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
            padding: '12px 0'
        }}>
            <div className="dot" style={{ animationDelay: '0s' }} />
            <div className="dot" style={{ animationDelay: '0.2s' }} />
            <div className="dot" style={{ animationDelay: '0.4s' }} />

            <style>{`
                .dot {
                    width: 8px;
                    height: 8px;
                    background: var(--primary);
                    border-radius: 50%;
                    opacity: 0.3;
                    animation: pulse 1.4s infinite ease-in-out;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(0.8); opacity: 0.3; }
                    50% { transform: scale(1.2); opacity: 1; }
                }
            `}</style>
            <span style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                marginLeft: '8px',
                letterSpacing: '0.5px'
            }}>AI is thinking...</span>
        </div>
    );
};

export default TextLoader;
