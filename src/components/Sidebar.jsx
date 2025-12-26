import React from 'react';

const Sidebar = ({ conversations, onSelectConversation, activeConversationId, onNewChat }) => {
    return (
        <div style={{
            width: '260px',
            height: '100vh',
            background: 'rgba(15, 15, 15, 0.95)',
            borderRight: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1000,
            padding: '20px 10px'
        }}>
            <button
                onClick={onNewChat}
                className="btn-primary"
                style={{
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '12px'
                }}
            >
                <span style={{ fontSize: '20px' }}>+</span> New Chat
            </button>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
            }}>
                <h3 style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    padding: '0 10px',
                    marginBottom: '10px'
                }}>Recent</h3>

                {conversations.map((conv) => (
                    <div
                        key={conv._id}
                        onClick={() => onSelectConversation(conv._id)}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: activeConversationId === conv._id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                            color: activeConversationId === conv._id ? 'white' : 'var(--text-muted)',
                            fontSize: '14px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            if (activeConversationId !== conv._id) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.color = 'white';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeConversationId !== conv._id) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--text-muted)';
                            }
                        }}
                    >
                        {conv.title}
                    </div>
                ))}
            </div>

            <div style={{
                padding: '10px',
                borderTop: '1px solid var(--glass-border)',
                marginTop: '10px',
                fontSize: '12px',
                color: 'var(--text-muted)',
                textAlign: 'center'
            }}>
                AI Assistant v1.0
            </div>
        </div>
    );
};

export default Sidebar;
