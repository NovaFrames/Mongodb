const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createImage, editImage, getPrompts, getUserPrompts, generateText, getConversations, getConversationPrompts } = require('../controllers/promptController');
const auth = require('../middleware/auth');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/generate', auth, createImage);
router.post('/generate-edit', auth, upload.single('image'), editImage);
router.post('/generate-text', auth, generateText);
router.get('/', getPrompts);
router.get('/mine', auth, getUserPrompts);
router.get('/conversations', auth, getConversations);
router.get('/conversations/:id', auth, getConversationPrompts);
router.get('/test', (req, res) => res.json({ success: true, message: 'Prompt routes are active' }));

module.exports = router;
