import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, speed = 30, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, text, speed, onComplete]);

    return (
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {displayedText}
            {currentIndex < text.length && (
                <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '1.2em',
                    background: 'var(--primary)',
                    marginLeft: '4px',
                    verticalAlign: 'middle',
                    animation: 'blink 1s infinite'
                }} />
            )}
            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default Typewriter;
