import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Generator = ({ initialHistory = [], conversationId, onGenerateSuccess, onGenerateStart, onGenerateEnd }) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [style, setStyle] = useState('Realistic');
    const [textLoading, setTextLoading] = useState(false);
    const [error, setError] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        if (initialHistory && initialHistory.length > 0) {
            const history = [];
            // DB items are sorted by createdAt ASC for a conversation
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
        if (onGenerateStart) onGenerateStart();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/prompts/generate',
                { prompt: currentPrompt, style, useGemini, conversationId },
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
            );
            if (response.data.success) {
                // Add the generated image to chat history
                setChatHistory(prev => [...prev, {
                    type: 'ai',
                    content: response.data.data.imageUrl,
                    contentType: 'image',
                    prompt: response.data.data.prompt
                }]);
                onGenerateSuccess(response.data.data, response.data.conversationId);
                setPrompt('');
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
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/prompts/generate-text',
                { prompt: currentPrompt, style, conversationId },
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
            );
            if (response.data.success) {
                setChatHistory(prev => [...prev, { type: 'ai', content: response.data.data.aiResponse, contentType: 'text' }]);
                onGenerateSuccess(response.data.data, response.data.conversationId);
                setPrompt('');
                setError('');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Text generation failed.");
        } finally {
            setTextLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '900px', marginBottom: '80px' }}>
            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', minHeight: '200px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {chatHistory.length === 0 && !textLoading && !loading && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>How can I help you today?</h3>
                        <p>Start by typing a prompt below to generate images or text.</p>
                    </div>
                )}
                {chatHistory.map((chat, index) => (
                    <div key={index} style={{ alignSelf: chat.type === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{
                            padding: chat.contentType === 'image' ? '8px' : '12px 18px',
                            borderRadius: '18px',
                            background: chat.type === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                            color: 'var(--text-main)',
                            fontSize: '1rem',
                            border: chat.type === 'user' ? 'none' : '1px solid var(--glass-border)',
                            borderBottomRightRadius: chat.type === 'user' ? '4px' : '18px',
                            borderBottomLeftRadius: chat.type === 'ai' ? '4px' : '18px',
                            overflow: 'hidden'
                        }}>
                            {chat.contentType === 'image' ? (
                                <img src={chat.content} alt={chat.prompt} style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
                            ) : (
                                chat.content
                            )}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '8px' }}>{chat.type === 'user' ? 'You' : 'AI Assistant'}</span>
                    </div>
                ))}
                {(textLoading || loading) && (
                    <div style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ padding: '12px 18px', borderRadius: '18px', background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontSize: '0.9rem', border: '1px solid var(--glass-border)', borderBottomLeftRadius: '4px' }}>
                            {loading ? 'Generating image...' : 'AI is thinking...'}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '8px' }}>AI Assistant</span>
                    </div>
                )}
            </div>
            <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                    <div style={{ position: 'relative' }}>
                        <textarea placeholder="Message AI..." value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerateText())} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '16px 60px 16px 16px', color: 'var(--text-main)', fontSize: '1rem', resize: 'none', minHeight: '60px', maxHeight: '200px', outline: 'none' }} />
                        <button onClick={handleGenerateText} disabled={textLoading || loading || !prompt} style={{ position: 'absolute', right: '12px', bottom: '12px', background: 'var(--primary)', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: !prompt || textLoading || loading ? 0.5 : 1 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg></button>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <select value={style} onChange={(e) => setStyle(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', outline: 'none', cursor: 'pointer' }}><option value="Realistic">Realistic</option><option value="Anime">Anime</option><option value="Cyberpunk">Cyberpunk</option><option value="Oil Painting">Oil Painting</option></select>
                        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                            <button className="btn-primary" onClick={() => handleGenerate(true)} disabled={loading || textLoading || !prompt} style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'linear-gradient(135deg, #4285F4, #34A853)' }}>{loading ? 'Generating...' : 'Generate Image'}</button>
                        </div>
                    </div>
                    {error && <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #ff4444', background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', fontSize: '0.85rem' }}>⚠️ {error}</div>}
                </div>
            </div>
        </div>
    );
};

export default Generator;
