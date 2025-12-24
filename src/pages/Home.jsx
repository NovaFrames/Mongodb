import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Generator from '../components/Generator';
import Gallery from '../components/Gallery';
import axios from 'axios';

const Home = () => {
    const [prompts, setPrompts] = useState([]);

    const fetchPrompts = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = token
                ? 'http://localhost:5000/api/prompts/mine'
                : 'http://localhost:5000/api/prompts';
            const response = await axios.get(url, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            if (response.data.success) {
                setPrompts(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching gallery:", error);
        }
    };

    useEffect(() => {
        fetchPrompts();
    }, []);

    const handleNewGeneration = (newPrompt) => {
        setPrompts([newPrompt, ...prompts]);
    };

    return (
        <div style={{ paddingTop: '80px' }}>
            <Hero />
            <Generator onGenerateSuccess={handleNewGeneration} />
            <Gallery items={prompts} />
        </div>
    );
};

export default Home;
