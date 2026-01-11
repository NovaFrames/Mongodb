import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    TextField,
    InputAdornment,
    Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

import { APPS } from '../data/apps';

const Home = ({ credits }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    const categories = ['All', 'Architecture', 'Interior', 'Enhancement'];

    const filteredApps = APPS.filter(app => {
        const matchesSearch = app.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'All' || (app.tags && app.tags.includes(category));
        return matchesSearch && matchesCategory;
    });

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header with Credits */}
            <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ mb: 1, fontWeight: 800 }}>Apps Library</Typography>
                        <Typography color="text.secondary">
                            Explore premium AI tools for architecture and design.
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{
                            px: 2,
                            py: 0.8,
                            bgcolor: 'rgba(234, 179, 8, 0.1)',
                            border: '1px solid rgba(234, 179, 8, 0.2)',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                            <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: 'primary.main' }}>
                                {credits || 0} CREDITS
                            </Typography>
                        </Box>
                        <TextField
                            placeholder="Search apps..."
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{
                                width: 260,
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                                    borderRadius: 3
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                    {categories.map((cat) => (
                        <Chip
                            key={cat}
                            label={cat}
                            onClick={() => setCategory(cat)}
                            sx={{
                                px: 1,
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                letterSpacing: '0.5px',
                                bgcolor: category === cat ? 'primary.main' : 'rgba(255, 255, 255, 0.05)',
                                color: category === cat ? 'black' : 'text.secondary',
                                border: 'none',
                                textTransform: 'uppercase',
                                '&:hover': {
                                    bgcolor: category === cat ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
                                }
                            }}
                        />
                    ))}
                </Box>
            </Box>

            <Grid container spacing={3}> {/* Reduced spacing slightly for better density */}
                {filteredApps.map((app) => (
                    <Grid item xs={4} sm={4} lg={4} key={app.id} sx={{ display: 'flex' }}>
                        <Card sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%', // Ensuring full width of grid item
                            bgcolor: '#0D0D0D',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: 1.5, // Refined slightly smaller radius
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'translateY(-6px)',
                                borderColor: 'primary.main',
                                boxShadow: '0 8px 30px rgba(234, 179, 8, 0.15)',
                                '& .before-image': {
                                    opacity: 1
                                },
                                '& .after-image': {
                                    transform: 'scale(1.05)'
                                }
                            }
                        }}
                            onClick={() => navigate(`/app/${app.id}`)}
                        >
                            {/* {app.badge && (
                                <Chip
                                    label={app.badge}
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        left: 16,
                                        zIndex: 3,
                                        bgcolor: 'primary.main',
                                        color: 'black',
                                        fontWeight: 900,
                                        fontSize: '0.65rem',
                                        height: 20,
                                        borderRadius: 0.5
                                    }}
                                />
                            )} */}
                            <Box sx={{
                                position: 'relative',
                                overflow: 'hidden',
                                height: 250, // Standardizing height to match reference image aspect
                                bgcolor: app.imageBg === 'bg-white' ? '#FFFFFF' : 'transparent'
                            }}>
                                {/* AFTER IMAGE (DEFAULT & SCALES ON HOVER) */}
                                <CardMedia
                                    className="after-image"
                                    component="img"
                                    image={app.beforeImage}
                                    alt={app.title}
                                    sx={{
                                        height: '100%',
                                        width: '100%',
                                        transition: 'transform 0.5s ease',
                                        objectFit: app.imageFit || 'cover'
                                    }}
                                />
                                {/* BEFORE IMAGE (FADES IN ON HOVER) */}
                                <CardMedia
                                    className="before-image"
                                    component="img"
                                    image={app.image}
                                    alt={`${app.title} Before`}
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        height: '100%',
                                        width: '100%',
                                        opacity: 0,
                                        transition: 'opacity 0.4s ease-in-out',
                                        objectFit: app.imageFit || 'cover',
                                        zIndex: 2,
                                        bgcolor: app.imageBg === 'bg-white' ? '#FFFFFF' : 'transparent'
                                    }}
                                />
                            </Box>
                            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                                <Typography
                                    sx={{
                                        fontSize: '0.6rem',
                                        fontWeight: 900,
                                        color: 'primary.main',
                                        letterSpacing: '1.2px',
                                        mb: 1,
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {app.tags?.join(' • ')}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.2, lineHeight: 1.2, fontSize: '1.1rem' }}>
                                    {app.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '0.85rem', lineHeight: 1.5 }}>
                                    {app.description}
                                </Typography>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<AutoAwesomeIcon sx={{ fontSize: '1rem !important' }} />}
                                    sx={{
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white',
                                        fontWeight: 800,
                                        py: 1,
                                        fontSize: '0.85rem',
                                        '&:hover': { bgcolor: 'primary.main', color: 'black', border: '1px solid transparent' }
                                    }}
                                >
                                    Try This App
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Home;
