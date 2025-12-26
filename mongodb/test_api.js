const axios = require('axios');

async function testApi() {
    try {
        console.log('Testing API /api/prompts/generate...');
        const response = await axios.post('https://mongodb-gcau.onrender.com/api/prompts/generate', {
            prompt: 'A futuristic banana',
            style: 'Realistic',
            useGemini: true
        });

        console.log('API Response Success:', response.data.success);
        if (response.data.success) {
            console.log('Data keys:', Object.keys(response.data.data));
            console.log('imageUrl:', response.data.data.imageUrl ? response.data.data.imageUrl.substring(0, 100) + '...' : 'undefined');
        } else {
            console.log('API Error:', response.data.message);
        }
    } catch (error) {
        console.error('Error calling API:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testApi();
