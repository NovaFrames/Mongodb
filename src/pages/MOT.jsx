import React, { useEffect, useState } from 'react';
import { UploadCloud, Trash2, Search, Box as BoxIcon, Plus } from 'lucide-react';
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material';
import axios from 'axios';

const categories = ['All', 'Material', 'Object', 'Texture'];

const MOT = () => {
    const [assets, setAssets] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isUploading, setIsUploading] = useState(false);
    const [search, setSearch] = useState('');
    const [uploadCategory, setUploadCategory] = useState('Material');
    const [uploadTags, setUploadTags] = useState('');
    const [dragActive, setDragActive] = useState(false);

    const filteredAssets = assets
        .filter((asset) => (activeCategory === 'All' ? true : asset.category === activeCategory))
        .filter((asset) =>
            asset.name.toLowerCase().includes(search.toLowerCase())
            || asset.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
        );

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/mot/assets', {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                });
                if (response.data.success) {
                    setAssets(response.data.data);
                }
            } catch (error) {
                setAssets([]);
            }
        };
        fetchAssets();
    }, []);

    const handleDrag = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.type === 'dragenter' || event.type === 'dragover') {
            setDragActive(true);
        } else if (event.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            handleFiles(event.dataTransfer.files);
        }
    };

    const handleChange = (event) => {
        event.preventDefault();
        if (event.target.files && event.target.files[0]) {
            handleFiles(event.target.files);
        }
    };

    const handleFiles = (files) => {
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (!event.target?.result) return;
                try {
                    const token = localStorage.getItem('token');
                    const payload = {
                        name: file.name.split('.')[0],
                        category: uploadCategory,
                        url: event.target.result,
                        tags: uploadTags.split(',').map((tag) => tag.trim()).filter(Boolean),
                    };
                    const response = await axios.post('http://localhost:5000/api/mot/assets', payload, {
                        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                    });
                    if (response.data.success) {
                        setAssets((prev) => [response.data.data, ...prev]);
                    }
                } catch (error) {
                    setAssets((prev) => prev);
                }
            };
            reader.readAsDataURL(file);
        });
        setIsUploading(false);
        setUploadTags('');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 3, md: 4 },
                color: 'text.primary',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, gap: 3, flexWrap: 'wrap' }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        MOT Library
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.4 }}>
                        Materials, Objects, and Textures Management
                    </Typography>
                </Box>
                <Button
                    onClick={() => setIsUploading(!isUploading)}
                    variant="contained"
                    startIcon={isUploading ? <BoxIcon size={18} /> : <Plus size={18} />}
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'black',
                        px: 2.5,
                        py: 1.1,
                        borderRadius: 2,
                        fontWeight: 700,
                        '&:hover': { bgcolor: 'primary.main', filter: 'brightness(1.05)' },
                    }}
                >
                    {isUploading ? 'View Library' : 'Add Asset'}
                </Button>
            </Box>

            {isUploading && (
                <Box
                    sx={{
                        mb: 4,
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.12)',
                        bgcolor: 'rgba(16,16,16,0.9)',
                        p: { xs: 3, md: 4 },
                        animation: 'fadeInUp 0.4s ease-out',
                        '@keyframes fadeInUp': {
                            from: { opacity: 0, transform: 'translateY(12px)' },
                            to: { opacity: 1, transform: 'translateY(0)' },
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 3 }}>
                        <UploadCloud size={20} color="#D4B04C" />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Upload New Asset
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Category
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {['Material', 'Object', 'Texture'].map((cat) => (
                                    <Button
                                        key={cat}
                                        onClick={() => setUploadCategory(cat)}
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 999,
                                            px: 2,
                                            py: 0.6,
                                            fontSize: '0.75rem',
                                            borderColor: uploadCategory === cat ? 'primary.main' : 'rgba(255,255,255,0.2)',
                                            bgcolor: uploadCategory === cat ? 'primary.main' : 'transparent',
                                            color: uploadCategory === cat ? 'black' : 'text.secondary',
                                            fontWeight: 700,
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                bgcolor: uploadCategory === cat ? 'primary.main' : 'rgba(255,255,255,0.05)',
                                            },
                                        }}
                                    >
                                        {cat}
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Tags (comma separated)
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="e.g. wood, dark, vintage"
                                value={uploadTags}
                                onChange={(event) => setUploadTags(event.target.value)}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'rgba(20,20,20,0.9)',
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                    <Box
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        sx={{
                            border: '2px dashed',
                            borderColor: dragActive ? 'primary.main' : 'rgba(255,255,255,0.2)',
                            bgcolor: dragActive ? 'rgba(212, 176, 76, 0.12)' : 'rgba(24,24,24,0.8)',
                            borderRadius: 3,
                            p: { xs: 4, md: 6 },
                            textAlign: 'center',
                            transition: 'all 0.2s',
                        }}
                    >
                        <UploadCloud size={44} color="rgba(255,255,255,0.4)" />
                        <Typography sx={{ mt: 2, fontWeight: 600 }}>
                            Drag & Drop files here
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            or click to browse
                        </Typography>
                        <input
                            id="mot-upload"
                            type="file"
                            multiple
                            onChange={handleChange}
                            style={{ display: 'none' }}
                        />
                        <Button
                            component="label"
                            htmlFor="mot-upload"
                            variant="outlined"
                            sx={{
                                mt: 2.5,
                                borderColor: 'rgba(255,255,255,0.2)',
                                color: 'text.primary',
                                '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                            }}
                        >
                            Select Files
                        </Button>
                    </Box>
                </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'inline-flex', gap: 1, p: 0.6, borderRadius: 2, border: '1px solid rgba(255,255,255,0.12)', bgcolor: 'rgba(12,12,12,0.8)' }}>
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            variant={activeCategory === cat ? 'contained' : 'text'}
                            sx={{
                                px: 2,
                                py: 0.6,
                                borderRadius: 1.5,
                                fontSize: '0.8rem',
                                color: activeCategory === cat ? 'black' : 'text.secondary',
                                bgcolor: activeCategory === cat ? 'primary.main' : 'transparent',
                                fontWeight: 600,
                                '&:hover': {
                                    bgcolor: activeCategory === cat ? 'primary.main' : 'rgba(255,255,255,0.06)',
                                },
                            }}
                        >
                            {cat}
                        </Button>
                    ))}
                </Box>

                <TextField
                    placeholder="Search assets..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    size="small"
                    sx={{
                        minWidth: { xs: '100%', sm: 320 },
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(12,12,12,0.9)',
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={16} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    pr: 1,
                    '&::-webkit-scrollbar': { width: 6 },
                    '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.15)', borderRadius: 999 },
                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                }}
            >
                {filteredAssets.length > 0 ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)', xl: 'repeat(6, 1fr)' }, gap: 2 }}>
                        {filteredAssets.map((asset) => (
                            <Box
                                key={asset._id}
                                sx={{
                                    position: 'relative',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    bgcolor: 'rgba(16,16,16,0.9)',
                                    aspectRatio: '1 / 1',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                    },
                                    '&:hover .asset-overlay': {
                                        transform: 'translateY(0)',
                                    },
                                }}
                            >
                                <Box component="img" src={asset.url} alt={asset.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <Box
                                    className="asset-overlay"
                                    sx={{
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        p: 2,
                                        bgcolor: 'rgba(0,0,0,0.8)',
                                        backdropFilter: 'blur(6px)',
                                        transform: 'translateY(100%)',
                                        transition: 'transform 0.2s',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }} noWrap>
                                                {asset.name}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'primary.main' }}>
                                                {asset.category}
                                            </Typography>
                                        </Box>
                                        <Button
                                            onClick={async () => {
                                                try {
                                                    const token = localStorage.getItem('token');
                                                    await axios.delete(`http://localhost:5000/api/mot/assets/${asset._id}`, {
                                                        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                                                    });
                                                    setAssets((prev) => prev.filter((item) => item._id !== asset._id));
                                                } catch (error) {
                                                    setAssets((prev) => prev);
                                                }
                                            }}
                                            sx={{
                                                minWidth: 'auto',
                                                p: 0.5,
                                                color: 'text.secondary',
                                                '&:hover': { color: '#ef4444' },
                                            }}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </Box>
                                    {asset.tags.length > 0 && (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mt: 1 }}>
                                            {asset.tags.slice(0, 3).map((tag) => (
                                                <Box
                                                    key={tag}
                                                    sx={{
                                                        fontSize: '0.6rem',
                                                        px: 1,
                                                        py: 0.3,
                                                        borderRadius: 1,
                                                        bgcolor: 'rgba(255,255,255,0.1)',
                                                        color: 'text.secondary',
                                                    }}
                                                >
                                                    #{tag}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            height: 180,
                            border: '1px dashed rgba(255,255,255,0.2)',
                            borderRadius: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'text.secondary',
                        }}
                    >
                        <BoxIcon size={28} style={{ opacity: 0.6 }} />
                        <Typography sx={{ mt: 1 }}>No assets found.</Typography>
                        <Button
                            onClick={() => setIsUploading(true)}
                            sx={{ mt: 1, color: 'primary.main', fontSize: '0.8rem' }}
                        >
                            Upload your first asset
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MOT;
