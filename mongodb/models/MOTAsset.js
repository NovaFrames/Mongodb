const mongoose = require('mongoose');

const motAssetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Material', 'Object', 'Texture'],
    },
    url: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('MOTAsset', motAssetSchema);
