import React from 'react';

const Card = ({ item }) => {
    console.log('Rendering Card with item:', item);
    return (
        <div className="glass-panel" style={{
            overflow: 'hidden',
            marginBottom: '24px',
            breakInside: 'avoid',
            position: 'relative',
            group: 'group',
        }}>
            <img
                src={item.imageUrl}
                alt={item.prompt}
                style={{
                    width: '100%',
                    display: 'block',
                    height: 'auto',
                }}
            />
            <div style={{
                padding: '16px',
            }}>
                <p style={{
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    marginBottom: '8px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontWeight: 'bold',
                }}>{item.aiResponse || item.prompt}</p>
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    marginBottom: '8px',
                    fontStyle: 'italic'
                }}>"{item.enhancedPrompt || item.prompt}"</p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                }}>
                    <span>{item.style}</span>
                    <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'}</span>
                </div>
            </div>
        </div>
    );
};

export default Card;
