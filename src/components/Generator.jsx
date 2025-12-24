import React, { useState } from 'react';
import axios from 'axios';

const Generator = ({ onGenerateSuccess }) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [style, setStyle] = useState('Realistic');
    const [textResponse, setTextResponse] = useState('');
    const [textLoading, setTextLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/prompts/generate',
                {
                    prompt,
                    style,
                },
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                }
            );
            if (response.data.success) {
                onGenerateSuccess(response.data.data);
                setPrompt('');
            }
        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateText = async () => {
        if (!prompt) return;
        setTextLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/prompts/generate-text',
                {
                    prompt,
                    style,
                },
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                }
            );
            if (response.data.success) {
                setTextResponse(response.data.data.aiResponse);
            }
        } catch (error) {
            console.error("Text generation failed", error);
        } finally {
            setTextLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', marginBottom: '80px' }}>
            <div className="glass-panel" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                    <textarea
                        placeholder="Describe what you want to see..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '16px',
                            color: 'var(--text-main)',
                            fontSize: '1.1rem',
                            resize: 'vertical',
                            minHeight: '120px',
                            outline: 'none',
                            fontFamily: 'inherit',
                        }}
                    />

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
                        <select
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            style={{
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--text-main)',
                                padding: '10px 16px',
                                borderRadius: 'var(--radius-sm)',
                                outline: 'none',
                            }}
                        >
                            <option value="Realistic">Realistic</option>
                            <option value="Anime">Anime</option>
                            <option value="Cyberpunk">Cyberpunk</option>
                            <option value="Oil Painting">Oil Painting</option>
                        </select>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                className="btn-primary"
                                onClick={handleGenerate}
                                disabled={loading || !prompt}
                                style={{ minWidth: '140px' }}
                            >
                                {loading ? 'Dreaming...' : 'Generate'}
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleGenerateText}
                                disabled={textLoading || !prompt}
                                style={{ minWidth: '140px' }}
                            >
                                {textLoading ? 'Thinking...' : 'Generate Text'}
                            </button>
                        </div>
                    </div>
                    {textResponse && (
                        <div style={{
                            padding: '16px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(0,0,0,0.35)',
                            color: 'var(--text-main)',
                            lineHeight: 1.5,
                        }}>
                            {textResponse}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Generator;
