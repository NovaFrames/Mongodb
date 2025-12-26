import React from 'react';

const Hero = () => {
    return (
        <div style={{
            textAlign: 'center',
            padding: '100px 0 60px',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <div className="glass-panel" style={{
                display: 'inline-block',
                padding: '8px 16px',
                borderRadius: '100px',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: 'var(--primary)',
                marginBottom: '24px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
                ✨ Powered by Advanced AI
            </div>
            <h1 style={{
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                marginBottom: '24px',
                lineHeight: 1,
                fontWeight: '900',
                letterSpacing: '-2px'
            }}>
                Visualize Your <br />
                <span className="accent-gradient">Wildest Dreams</span>
            </h1>
            <p style={{
                color: 'var(--text-muted)',
                fontSize: '1.1rem',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
            }}>
                Experience the next generation of AI creativity. Generate stunning art and intelligent responses in a seamless, premium interface.
            </p>
        </div>
    );
};

export default Hero;
