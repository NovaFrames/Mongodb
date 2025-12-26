import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateTextWithReasoning } from '../TextGeneratorModal/TextGeneratorModal';
import { generateImage } from '../ImageGenerationModal/ImageGenerationModal';

const Generator = ({ onGenerateSuccess }) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [style, setStyle] = useState('Realistic');
    const [textResponse, setTextResponse] = useState('');
    const [textLoading, setTextLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [imageResponse, setImageResponse] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState(null);

    const handleGenerate = async () => {
        if (!prompt) return;
        setImageLoading(true);
        setImageError(null);
        setImageResponse(null);

        try {
            const result = await generateImage(prompt);

            if (result.success) {
                setImageResponse(result);
            } else {
                setImageError(result.error);
            }
        } catch (error) {
            setImageError(error.message || 'An error occurred while generating images');
            console.error("Image generation failed", error);
        } finally {
            setImageLoading(false);
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

    const handleGenerateAI = async () => {
        if (!prompt) return;
        setAiLoading(true);
        setAiError(null);
        setAiResponse(null);

        try {
            const result = await generateTextWithReasoning(prompt);
            setAiResponse(result);
        } catch (error) {
            setAiError(error.message || 'An error occurred while generating AI text');
            console.error("AI generation failed", error);
        } finally {
            setAiLoading(false);
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

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <button
                                className="btn-primary"
                                onClick={handleGenerate}
                                disabled={imageLoading || !prompt}
                                style={{ minWidth: '140px' }}
                            >
                                {imageLoading ? 'Generating...' : 'Generate Image'}
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleGenerateAI}
                                disabled={aiLoading || !prompt}
                                style={{ minWidth: '140px' }}
                            >
                                {aiLoading ? 'AI Thinking...' : 'Generate Text'}
                            </button>
                        </div>
                    </div>

                    {/* Image Error Display */}
                    {imageError && (
                        <div style={{
                            padding: '16px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(239, 68, 68, 0.5)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#fca5a5',
                            marginTop: '16px',
                        }}>
                            <strong>Error:</strong> {imageError}
                        </div>
                    )}

                    {/* Image Response Display */}
                    {imageResponse && imageResponse.images && imageResponse.images.length > 0 && (
                        <div style={{
                            marginTop: '16px',
                            padding: '20px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(139, 92, 246, 0.5)',
                            background: 'rgba(139, 92, 246, 0.1)',
                        }}>
                            <h3 style={{
                                margin: '0 0 16px 0',
                                color: '#a78bfa',
                                fontSize: '1.2rem',
                                fontWeight: '600',
                            }}>
                                Generated Images
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '16px',
                            }}>
                                {imageResponse.images.map((imageUrl, index) => (
                                    <div key={index} style={{
                                        borderRadius: 'var(--radius-sm)',
                                        overflow: 'hidden',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(0,0,0,0.3)',
                                    }}>
                                        <img
                                            src={imageUrl}
                                            alt={`Generated image ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                display: 'block',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Text Error Display */}
                    {aiError && (
                        <div style={{
                            padding: '16px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(239, 68, 68, 0.5)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#fca5a5',
                            marginTop: '16px',
                        }}>
                            <strong>Error:</strong> {aiError}
                        </div>
                    )}

                    {/* Original Text Response */}
                    {textResponse && (
                        <div style={{
                            padding: '16px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(0,0,0,0.35)',
                            color: 'var(--text-main)',
                            lineHeight: 1.5,
                            marginTop: '16px',
                        }}>
                            <strong style={{ display: 'block', marginBottom: '8px', color: '#a78bfa' }}>Text Response:</strong>
                            {textResponse}
                        </div>
                    )}

                    {/* AI Response with Reasoning */}
                    {aiResponse && (
                        <div style={{
                            marginTop: '16px',
                            padding: '20px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(102, 126, 234, 0.5)',
                            background: 'rgba(102, 126, 234, 0.1)',
                        }}>
                            <h3 style={{
                                margin: '0 0 16px 0',
                                color: '#a78bfa',
                                fontSize: '1.2rem',
                                fontWeight: '600',
                            }}>
                                AI Response with Reasoning
                            </h3>

                            {/* Content */}
                            <div style={{
                                padding: '16px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'rgba(0,0,0,0.3)',
                                marginBottom: '16px',
                            }}>
                                <strong style={{ display: 'block', marginBottom: '8px', color: '#c4b5fd' }}>
                                    Content:
                                </strong>
                                <div style={{
                                    color: 'var(--text-main)',
                                    lineHeight: 1.6,
                                }} className="markdown-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {aiResponse.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Generator;
