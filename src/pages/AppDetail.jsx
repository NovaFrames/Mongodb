import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Breadcrumbs,
    Link as MuiLink,
    Chip,
    TextField,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import axios from 'axios';

import { APPS } from '../data/apps';

const AppDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const app = APPS.find(a => a.id === parseInt(id));
    const [credits, setCredits] = useState(() => Number(localStorage.getItem('credits') || 0));
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [generatedImageUrl, setGeneratedImageUrl] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [error, setError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [showGenerated, setShowGenerated] = useState(false);
    const fileInputRef = useRef(null);

    if (!app) return <Typography>App not found</Typography>;

    useEffect(() => {
        if (!previewUrl) return;
        return () => {
            URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    useEffect(() => {
        const syncCredits = () => {
            setCredits(Number(localStorage.getItem('credits') || 0));
        };
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                syncCredits();
            }
        };
        syncCredits();
        window.addEventListener('focus', syncCredits);
        window.addEventListener('storage', syncCredits);
        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            window.removeEventListener('focus', syncCredits);
            window.removeEventListener('storage', syncCredits);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []);

    useEffect(() => {
        if (isGenerating) {
            setSnackbarMessage('Credits on hold');
            setSnackbarSeverity('info');
            setSnackbarOpen(true);
        } else if (snackbarSeverity === 'info') {
            setSnackbarOpen(false);
        }
    }, [isGenerating, snackbarSeverity]);

    const handleFileSelect = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file.');
            return;
        }
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(file);
        setGeneratedImageUrl('');
        setPreviewUrl(URL.createObjectURL(file));
        setError('');
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files?.[0];
        handleFileSelect(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        handleFileSelect(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleGenerate = async () => {
        if (!selectedFile) {
            setError('Please upload an image.');
            setSnackbarMessage('Please upload an image.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        if (!prompt.trim()) {
            setError('Please add a short instruction.');
            setSnackbarMessage('Please add a short instruction.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        setIsGenerating(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('prompt', prompt.trim());
            formData.append('image', selectedFile);

            const response = await axios.post(
                'http://localhost:5000/api/prompts/generate-edit',
                formData,
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
            );

            if (response.data.success) {
                setGeneratedImageUrl(response.data.data.imageUrl);
                setShowGenerated(true);
                if (typeof response.data.credits === 'number') {
                    localStorage.setItem('credits', String(response.data.credits));
                    setCredits(response.data.credits);
                }
                setSnackbarMessage('Image generated successfully.');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } else {
                const message = response.data.message || response.data.error || 'Request failed. Please try again.';
                setError(message);
                setSnackbarMessage(message);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (err) {
            const message = err.response?.data?.message
                || err.response?.data?.error
                || err.response?.data?.details
                || 'Request failed. Please try again.';
            setError(message);
            setSnackbarMessage(message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setIsGenerating(false);
        }
    };

    const beforeImage = previewUrl || app.image;
    const afterImage = generatedImageUrl || app.beforeImage;

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            <Snackbar
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{ fontWeight: 600 }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {/* App Header / Breadcrumbs */}
            <Box sx={{ p: 4, pb: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
                        sx={{ '& .MuiBreadcrumbs-li': { fontSize: '0.8rem' } }}
                    >
                        <MuiLink
                            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', textDecoration: 'none' }}
                            onClick={() => navigate('/')}
                        >
                            <HomeIcon sx={{ fontSize: '1rem' }} /> Apps
                        </MuiLink>
                        <Typography color="primary" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                            {app.title}
                        </Typography>
                    </Breadcrumbs>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        {app.badge && (
                            <Chip
                                label={app.badge}
                                size="small"
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'black',
                                    fontWeight: 900,
                                    fontSize: '0.65rem',
                                    height: 24,
                                    borderRadius: 0.5
                                }}
                            />
                        )}
                        <Box sx={{
                            px: 2,
                            py: 0.8,
                            bgcolor: 'rgba(212, 176, 76, 0.1)',
                            border: '1px solid rgba(212, 176, 76, 0.2)',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                            <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: 'primary.main' }}>
                                {credits} CREDITS
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{app.title}</Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>{app.description}</Typography>
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Left: Upload Area */}
                <Box sx={{ width: '50%', p: 6, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="overline" sx={{ fontWeight: 900, mb: 2, color: 'primary.main', fontSize: '0.75rem' }}>
                        UPLOAD
                    </Typography>
                    <Box sx={{
                        flexGrow: 1,
                        maxHeight: 380,
                        border: '1px dashed rgba(255,255,255,0.15)',
                        borderRadius: 2, // Smaller radius for professional look
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        bgcolor: 'rgba(255,255,255,0.01)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        borderColor: isDragging ? 'primary.main' : 'rgba(255,255,255,0.15)',
                        bgcolor: isDragging ? 'rgba(212, 176, 76, 0.08)' : 'rgba(255,255,255,0.01)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.03)', borderColor: 'primary.main' }
                    }}
                        onClick={handleUploadClick}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            style={{ display: 'none' }}
                        />
                        <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5 }} />
                        <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
                            {selectedFile ? 'IMAGE SELECTED' : 'UPLOAD IMAGE OR DRAG & DROP'}
                        </Typography>
                        {selectedFile && (
                            <Typography color="text.secondary" variant="caption" sx={{ letterSpacing: '0.4px' }}>
                                {selectedFile.name}
                            </Typography>
                        )}
                    </Box>
                    <TextField
                        fullWidth
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        placeholder="Describe the change you want"
                        variant="outlined"
                        size="large"
                        sx={{ mt: 3 }}
                        rows={5}
                    />
                    {error && (
                        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                            {error}
                        </Typography>
                    )}

                    <Box sx={{ mt: 'auto', pt: 6 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<AutoAwesomeIcon />}
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'black',
                                fontWeight: 800,
                                py: 1.8,
                                mb: 1.5,
                                fontSize: '1rem',
                                '&:hover': { bgcolor: 'primary.dark' }
                            }}
                            disabled={isGenerating || !selectedFile || !prompt.trim()}
                            onClick={handleGenerate}
                        >
                            {isGenerating ? <CircularProgress size={22} sx={{ color: 'black' }} /> : 'Generate'}
                        </Button>
                        {generatedImageUrl && (
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{
                                    mt: 1.2,
                                    borderColor: 'rgba(255,255,255,0.2)',
                                    color: 'text.primary',
                                    fontWeight: 700,
                                    '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
                                }}
                                onClick={() => setShowGenerated((prev) => !prev)}
                            >
                                {showGenerated ? 'Hide Generated Image' : 'View Generated Image'}
                            </Button>
                        )}
                        {isGenerating && (
                            <Box
                                sx={{
                                    mt: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 0.6,
                                    color: 'text.secondary',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.6px',
                                    '@keyframes creditsPulse': {
                                        '0%, 100%': { opacity: 0.4 },
                                        '50%': { opacity: 1 }
                                    },
                                    '@keyframes creditsDot': {
                                        '0%, 80%, 100%': { transform: 'scale(0.7)', opacity: 0.4 },
                                        '40%': { transform: 'scale(1)', opacity: 1 }
                                    }
                                }}
                            >
                                <Box component="span" sx={{ animation: 'creditsPulse 1.2s ease-in-out infinite' }}>
                                    Credits on hold
                                </Box>
                                <Box component="span" sx={{ display: 'inline-flex', gap: 0.4 }}>
                                    <Box component="span" sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'text.secondary', animation: 'creditsDot 1s ease-in-out infinite' }} />
                                    <Box component="span" sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'text.secondary', animation: 'creditsDot 1s ease-in-out infinite 0.2s' }} />
                                    <Box component="span" sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'text.secondary', animation: 'creditsDot 1s ease-in-out infinite 0.4s' }} />
                                </Box>
                            </Box>
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', letterSpacing: '0.5px' }}>
                            Your request will cost {app.cost} credits
                        </Typography>
                    </Box>
                </Box>

                {/* Right: Preview Area */}
                <Box sx={{
                    width: '50%',
                    bgcolor: 'rgba(255,255,255,0.01)',
                    borderLeft: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                    position: 'relative'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                        <Box sx={{
                            width: 120,
                            height: 120,
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 2,
                            overflow: 'hidden',
                            bgcolor: app.imageBg === 'bg-white' ? '#FFFFFF' : 'transparent'
                        }}>
                            <img
                                src={beforeImage}
                                alt="Before preview"
                                style={{ width: '100%', height: '100%', objectFit: app.imageFit || 'cover' }}
                            />
                        </Box>
                        <NavigateNextIcon sx={{ color: 'text.secondary', opacity: 0.5 }} />
                        <Box sx={{
                            width: 120,
                            height: 120,
                            bgcolor: app.imageBg === 'bg-white' ? '#FFFFFF' : 'rgba(212, 176, 76, 0.05)',
                            border: '1px solid rgba(212, 176, 76, 0.3)',
                            borderRadius: 2,
                            overflow: 'hidden'
                        }}>
                            <img
                                src={afterImage}
                                alt="After preview"
                                style={{ width: '100%', height: '100%', objectFit: app.imageFit || 'cover' }}
                            />
                        </Box>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Ready to create</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        {generatedImageUrl ? 'Your image is ready.' : 'Upload an image and add instructions to get started'}
                    </Typography>
                    {generatedImageUrl && showGenerated && (
                        <Box
                            sx={{
                                mt: 3,
                                width: '100%',
                                maxWidth: 420,
                                borderRadius: 3,
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.1)',
                                bgcolor: 'rgba(16,16,16,0.9)',
                            }}
                        >
                            <Box
                                component="img"
                                src={generatedImageUrl}
                                alt="Generated"
                                sx={{ width: '100%', display: 'block' }}
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default AppDetail;
