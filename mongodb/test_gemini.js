const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function testGemini() {
    try {
        console.log('Testing Gemini API...');
        console.log('GEMINI_API_KEY defined:', !!process.env.GEMINI_API_KEY);
        if (process.env.GEMINI_API_KEY) {
            console.log('Length:', process.env.GEMINI_API_KEY.length);
            console.log('Starts with:', process.env.GEMINI_API_KEY.substring(0, 3));
        }
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: "Hello",
        });
        console.log('Response keys:', Object.keys(response));
        if (response.candidates) {
            console.log('Candidates count:', response.candidates.length);
            console.log('Candidate 0 keys:', Object.keys(response.candidates[0]));
        }
    } catch (error) {
        console.error('Error testing Gemini:', error.message);
    }
}

testGemini();
