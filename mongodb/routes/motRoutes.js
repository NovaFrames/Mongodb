const express = require('express');
const auth = require('../middleware/auth');
const { getAssets, createAsset, deleteAsset } = require('../controllers/motController');

const router = express.Router();

router.get('/assets', auth, getAssets);
router.post('/assets', auth, createAsset);
router.delete('/assets/:id', auth, deleteAsset);

module.exports = router;
