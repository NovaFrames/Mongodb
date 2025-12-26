import React from 'react';

const Sidebar = ({ conversations, onSelectConversation, activeConversationId, onNewChat, isOpen, onToggle }) => {
    return (
        <>
            {/* Mobile Toggle Button (Visible when sidebar is closed) */}
            {!isOpen && (
                <button
                    onClick={onToggle}
                    style={{
                        position: 'fixed',
                        left: '20px',
                        top: '20px',
                        zIndex: 1100,
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'var(--glass)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid var(--glass-border)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        transition: 'var(--transition)'
                    }}
                >
                    ☰
                </button>
            )}

            <div style={{
                width: 'var(--sidebar-width)',
                height: '100vh',
                background: 'rgba(10, 10, 10, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                left: isOpen ? '0' : 'calc(-1 * var(--sidebar-width))',
                top: 0,
                zIndex: 1000,
                padding: '100px 16px 24px', // Increased top padding for navbar
                transition: 'var(--transition)',
                boxShadow: isOpen ? '20px 0 50px rgba(0,0,0,0.5)' : 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                        <span className="accent-gradient">Nova</span>
                    </div>
                    <button
                        onClick={onToggle}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '20px'
                        }}
                    >
                        ✕
                    </button>
                </div>

                <button
                    onClick={onNewChat}
                    className="btn-primary"
                    style={{
                        marginBottom: '32px',
                        width: '100%',
                        padding: '14px',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: '0.9rem',
                        letterSpacing: '0.5px'
                    }}
                >
                    <span style={{ fontSize: '18px' }}>+</span> New Chat
                </button>

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    paddingRight: '4px'
                }}>
                    <h3 style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        padding: '0 12px',
                        marginBottom: '8px',
                        fontWeight: '700'
                    }}>Recent Chats</h3>

                    {conversations.map((conv) => (
                        <div
                            key={conv._id}
                            onClick={() => onSelectConversation(conv._id)}
                            className="glass-panel"
                            style={{
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                background: activeConversationId === conv._id ? 'var(--glass-hover)' : 'transparent',
                                border: activeConversationId === conv._id ? '1px solid var(--glass-border)' : '1px solid transparent',
                                color: activeConversationId === conv._id ? 'var(--text-main)' : 'var(--text-muted)',
                                fontSize: '0.9rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                transition: 'var(--transition)'
                            }}
                        >
                            {conv.title}
                        </div>
                    ))}

                    {conversations.length === 0 && (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                            No recent chats
                        </div>
                    )}
                </div>

                <div style={{
                    padding: '20px 10px 0',
                    borderTop: '1px solid var(--glass-border)',
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '600' }}>NovaPrompt AI</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>v1.2.0 • Pro Plan</div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
