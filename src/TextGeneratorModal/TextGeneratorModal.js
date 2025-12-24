/**
 * AI Text Generator Utility Function
 * Uses OpenRouter API with NVIDIA Nemotron model for text generation with reasoning
 * 
 * @param {string} userPrompt - The user's input prompt
 * @returns {Promise<Object>} - Returns an object with content and reasoning_details
 */

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const generateTextWithReasoning = async (userPrompt) => {
    if (!userPrompt || userPrompt.trim() === '') {
        throw new Error('Prompt cannot be empty');
    }

    if (!API_KEY) {
        throw new Error('API key is not configured. Please add VITE_OPENROUTER_API_KEY to your .env file');
    }

    try {
        // API call with reasoning enabled
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "nvidia/nemotron-3-nano-30b-a3b:free",
                "messages": [
                    {
                        "role": "user",
                        "content": userPrompt
                    }
                ],
                "reasoning": { "enabled": true }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
        }

        const result = await response.json();

        if (!result.choices || !result.choices[0] || !result.choices[0].message) {
            throw new Error('Invalid response format from API');
        }

        const message = result.choices[0].message;

        return {
            content: message.content,
            reasoning_details: message.reasoning_details || null,
            model: result.model || "nvidia/nemotron-3-nano-30b-a3b:free",
            usage: result.usage || null
        };
    } catch (error) {
        console.error('Text generation error:', error);
        throw error;
    }
};

export default generateTextWithReasoning;