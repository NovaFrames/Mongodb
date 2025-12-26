import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Generator from '../components/Generator';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const Home = ({ isLoggedIn }) => {
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [prompts, setPrompts] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchConversations = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await axios.get('http://localhost:5000/api/prompts/conversations', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                setConversations(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    const fetchConversationPrompts = async (convId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:5000/api/prompts/conversations/${convId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            if (response.data.success) {
                setPrompts(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching conversation prompts:", error);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchConversations();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (activeConversationId) {
            fetchConversationPrompts(activeConversationId);
        } else {
            setPrompts([]);
        }
    }, [activeConversationId]);

    const handleNewGeneration = (newPrompt, convId) => {
        if (convId && !activeConversationId) {
            setActiveConversationId(convId);
            fetchConversations();
        } else if (convId === activeConversationId) {
            setPrompts(prev => [...prev, newPrompt]);
        }
    };

    const handleNewChat = () => {
        setActiveConversationId(null);
        setPrompts([]);
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {isLoggedIn && (
                <Sidebar
                    conversations={conversations}
                    onSelectConversation={setActiveConversationId}
                    activeConversationId={activeConversationId}
                    onNewChat={handleNewChat}
                    isOpen={isSidebarOpen}
                    onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                />
            )}
            <div className="main-content" style={{
                marginLeft: isLoggedIn && isSidebarOpen && window.innerWidth > 768 ? 'var(--sidebar-width)' : '0',
            }}>
                <div className="container animate-fade-in">
                    <Hero />
                    <Generator
                        initialHistory={prompts}
                        conversationId={activeConversationId}
                        onGenerateSuccess={handleNewGeneration}
                        onGenerateStart={() => setIsGenerating(true)}
                        onGenerateEnd={() => setIsGenerating(false)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
