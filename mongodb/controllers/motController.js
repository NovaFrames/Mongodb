const MOTAsset = require('../models/MOTAsset');

exports.getAssets = async (req, res) => {
    try {
        const userId = req.user?.id;
        const assets = await MOTAsset.find({ user: userId }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: assets });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch assets' });
    }
};

exports.createAsset = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { name, category, url, tags } = req.body;

        if (!name || !category || !url) {
            return res.status(400).json({ success: false, message: 'Name, category, and url are required' });
        }

        const asset = new MOTAsset({
            name,
            category,
            url,
            tags: Array.isArray(tags) ? tags : [],
            user: userId,
        });

        const saved = await asset.save();
        return res.status(201).json({ success: true, data: saved });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to create asset' });
    }
};

exports.deleteAsset = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        const asset = await MOTAsset.findOne({ _id: id, user: userId });
        if (!asset) {
            return res.status(404).json({ success: false, message: 'Asset not found' });
        }

        await asset.deleteOne();
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to delete asset' });
    }
};
