import React from 'react';

const Hero = () => {
    return (
        <div style={{
            textAlign: 'center',
            padding: '160px 0 80px',
        }}>
            <h1 style={{
                fontSize: '4rem',
                marginBottom: '24px',
                lineHeight: 1.1,
            }}>
                Visualize Your <br />
                <span className="gradient-text">Wildest Dreams</span>
            </h1>
            <p style={{
                color: 'var(--text-muted)',
                fontSize: '1.2rem',
                maxWidth: '600px',
                margin: '0 auto',
            }}>
                Generate stunning AI art in seconds. Unleash your creativity with our advanced prompt engineering platform.
            </p>
        </div>
    );
};

export default Hero;
