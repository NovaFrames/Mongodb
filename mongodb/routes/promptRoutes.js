const express = require('express');
const router = express.Router();
const { createImage, getPrompts, getUserPrompts, generateText, getConversations, getConversationPrompts } = require('../controllers/promptController');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

router.post('/generate', optionalAuth, createImage);
router.post('/generate-text', optionalAuth, generateText);
router.get('/', getPrompts);
router.get('/mine', auth, getUserPrompts);
router.get('/conversations', auth, getConversations);
router.get('/conversations/:id', auth, getConversationPrompts);
router.get('/test', (req, res) => res.json({ success: true, message: 'Prompt routes are active' }));

module.exports = router;
