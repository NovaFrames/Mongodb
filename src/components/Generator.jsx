import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Generator = ({ initialHistory = [], conversationId, onGenerateSuccess, onGenerateStart, onGenerateEnd, onCreditsUpdate }) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [style, setStyle] = useState('Realistic');
    const [textLoading, setTextLoading] = useState(false);
    const [error, setError] = useState('');
    const [editFile, setEditFile] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, loading, textLoading]);

    useEffect(() => {
        if (initialHistory && initialHistory.length > 0) {
            const history = [];
            initialHistory.forEach(item => {
                history.push({ type: 'user', content: item.prompt });
                if (item.imageUrl) {
                    history.push({
                        type: 'ai',
                        content: item.imageUrl,
                        contentType: 'image',
                        prompt: item.prompt
                    });
                } else if (item.aiResponse) {
                    history.push({
                        type: 'ai',
                        content: item.aiResponse,
                        contentType: 'text'
                    });
                }
            });
            setChatHistory(history);
        } else if (initialHistory && initialHistory.length === 0) {
            setChatHistory([]);
        }
    }, [initialHistory]);

    const handleGenerate = async (useGemini = false) => {
        if (!prompt) return;
        setLoading(true);
        const currentPrompt = prompt;
        setChatHistory(prev => [...prev, { type: 'user', content: currentPrompt }]);
        setPrompt('');
        if (onGenerateStart) onGenerateStart();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/prompts/generate',
                { prompt: currentPrompt, style, useGemini, conversationId },
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
            );
            if (response.data.success) {
                setChatHistory(prev => [...prev, {
                    type: 'ai',
                    content: response.data.data.imageUrl,
                    contentType: 'image',
                    prompt: response.data.data.prompt
                }]);
                if (typeof response.data.credits === 'number') {
                    localStorage.setItem('credits', String(response.data.credits));
                    if (onCreditsUpdate) {
                        onCreditsUpdate(response.data.credits);
                    }
                }
                onGenerateSuccess(response.data.data, response.data.conversationId);
                setError('');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Generation failed.");
        } finally {
            setLoading(false);
            if (onGenerateEnd) onGenerateEnd();
        }
    };

    const handleGenerateText = async () => {
        if (!prompt) return;
        setTextLoading(true);
        const currentPrompt = prompt;
        setChatHistory(prev => [...prev, { type: 'user', content: currentPrompt }]);
        setPrompt('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/prompts/generate-text',
                { prompt: currentPrompt, style, conversationId },
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
            );
            if (response.data.success) {
                setChatHistory(prev => [...prev, { type: 'ai', content: response.data.data.aiResponse, contentType: 'text' }]);
                if (typeof response.data.credits === 'number') {
                    localStorage.setItem('credits', String(response.data.credits));
                    if (onCreditsUpdate) {
                        onCreditsUpdate(response.data.credits);
                    }
                }
                onGenerateSuccess(response.data.data, response.data.conversationId);
                setError('');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Text generation failed.");
        } finally {
            setTextLoading(false);
        }
    };

    const handleEditImage = async () => {
        if (!prompt || !editFile) return;
        setEditLoading(true);
        setEditError('');
        setError('');
        const currentPrompt = prompt;
        setChatHistory(prev => [...prev, { type: 'user', content: currentPrompt }]);
        setPrompt('');
        if (onGenerateStart) onGenerateStart();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('prompt', currentPrompt);
            formData.append('style', style);
            if (conversationId) {
                formData.append('conversationId', conversationId);
            }
            formData.append('image', editFile);

            const response = await axios.post(
                'http://localhost:5000/api/prompts/generate-edit',
                formData,
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
            );

            if (response.data.success) {
                setChatHistory(prev => [...prev, {
                    type: 'ai',
                    content: response.data.data.imageUrl,
                    contentType: 'image',
                    prompt: response.data.data.prompt
                }]);
                if (typeof response.data.credits === 'number') {
                    localStorage.setItem('credits', String(response.data.credits));
                    if (onCreditsUpdate) {
                        onCreditsUpdate(response.data.credits);
                    }
                }
                setEditFile(null);
                onGenerateSuccess(response.data.data, response.data.conversationId);
                setEditError('');
            }
        } catch (err) {
            setEditError(err.response?.data?.message || "Image edit failed.");
        } finally {
            setEditLoading(false);
            if (onGenerateEnd) onGenerateEnd();
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '150px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '40px' }}>
                {chatHistory.length === 0 && !textLoading && !loading && (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', borderStyle: 'dashed' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🤖</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Welcome to NovaPrompt</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                            Type a message below to start a conversation or generate stunning AI images.
                        </p>
                    </div>
                )}

                {chatHistory.map((chat, index) => (
                    <div key={index} className="animate-fade-in" style={{
                        alignSelf: chat.type === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        <div style={{
                            padding: chat.contentType === 'image' ? '12px' : '16px 24px',
                            borderRadius: '24px',
                            background: chat.type === 'user' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--glass)',
                            color: 'var(--text-main)',
                            fontSize: '1rem',
                            border: '1px solid var(--glass-border)',
                            borderBottomRightRadius: chat.type === 'user' ? '4px' : '24px',
                            borderBottomLeftRadius: chat.type === 'ai' ? '4px' : '24px',
                            boxShadow: chat.type === 'user' ? '0 4px 15px var(--primary-glow)' : 'none',
                            lineHeight: '1.6'
                        }}>
                            {chat.contentType === 'image' ? (
                                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
                                    <img src={chat.content} alt={chat.prompt} style={{ width: '100%', display: 'block', transition: 'transform 0.5s' }} />
                                </div>
                            ) : (
                                chat.content
                            )}
                        </div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            padding: '0 12px',
                            display: 'flex',
                            justifyContent: chat.type === 'user' ? 'flex-end' : 'flex-start',
                            fontWeight: '600'
                        }}>
                            {chat.type === 'user' ? 'You' : 'Nova AI'}
                        </div>
                    </div>
                ))}

                {(textLoading || loading) && (
                    <div className="animate-fade-in" style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="glass-panel" style={{ padding: '16px 24px', borderRadius: '24px', borderBottomLeftRadius: '4px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div className="accent-gradient" style={{ fontWeight: '700' }}>
                                    {loading ? 'Generating Masterpiece...' : 'Thinking...'}
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1s infinite' }}></div>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--secondary)', animation: 'pulse 1s infinite 0.2s' }}></div>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1s infinite 0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
                position: 'fixed',
                bottom: '32px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'calc(100% - 48px)',
                maxWidth: '800px',
                zIndex: 100
            }}>
                <div className="glass-panel" style={{
                    padding: '16px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    background: 'rgba(15, 15, 15, 0.8)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                        <div style={{ position: 'relative' }}>
                            <textarea
                                placeholder="Ask Nova anything..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerateText())}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '16px 120px 16px 20px',
                                    color: 'var(--text-main)',
                                    fontSize: '1rem',
                                    resize: 'none',
                                    minHeight: '60px',
                                    maxHeight: '200px',
                                    outline: 'none',
                                    transition: 'var(--transition)'
                                }}
                            />
                            <div style={{ position: 'absolute', right: '12px', bottom: '12px', display: 'flex', gap: '8px' }}>
                                <label
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'var(--text-main)',
                                        border: '1px solid var(--glass-border)',
                                        padding: '8px 12px',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    📎 Upload
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                <button
                                    onClick={handleEditImage}
                                    disabled={editLoading || textLoading || loading || !prompt || !editFile}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'var(--text-main)',
                                        border: '1px solid var(--glass-border)',
                                        padding: '8px 12px',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        opacity: !prompt || !editFile || editLoading || textLoading || loading ? 0.5 : 1
                                    }}
                                >
                                    {editLoading ? 'Editing...' : '✏️ Edit'}
                                </button>
                                <button
                                    onClick={() => handleGenerate(true)}
                                    disabled={loading || textLoading || !prompt}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'var(--text-main)',
                                        border: '1px solid var(--glass-border)',
                                        padding: '8px 12px',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    🎨 Image
                                </button>
                                <button
                                    onClick={handleGenerateText}
                                    disabled={textLoading || loading || !prompt}
                                    style={{
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: !prompt || textLoading || loading ? 0.5 : 1,
                                        boxShadow: '0 4px 10px var(--primary-glow)'
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg>
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '0 8px' }}>
                            <select
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.8rem',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                <option value="Realistic">Realistic Style</option>
                                <option value="Anime">Anime Style</option>
                                <option value="Cyberpunk">Cyberpunk Style</option>
                                <option value="Oil Painting">Oil Painting Style</option>
                            </select>
                            {editFile && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Selected: {editFile.name}
                                </div>
                            )}
                            <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Press Enter to send
                            </div>
                        </div>
                        {error && <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #ff4444', background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', fontSize: '0.85rem' }}>⚠️ {error}</div>}
                        {editError && <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #ff4444', background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', fontSize: '0.85rem' }}>⚠️ {editError}</div>}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
            `}</style>
        </div>
    );
};

export default Generator;
