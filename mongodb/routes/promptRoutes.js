const express = require('express');
const router = express.Router();
const { createImage, getPrompts, getUserPrompts, generateText } = require('../controllers/promptController');
const auth = require('../middleware/auth');

router.post('/generate', auth, createImage);
router.post('/generate-text', auth, generateText);
router.get('/', getPrompts);
router.get('/mine', auth, getUserPrompts);

module.exports = router;
