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
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

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
            <Box sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3, mb: 3, flexWrap: 'wrap' }}>
                    <Box>
                        <Typography variant="h4" sx={{ mb: 0.8, fontWeight: 800 }}>Apps Library</Typography>
                        <Typography color="text.secondary">
                            Materials, objects, and workflows for architectural AI.
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Box sx={{
                            px: 2.2,
                            py: 0.7,
                            bgcolor: 'rgba(212, 176, 76, 0.1)',
                            border: '1px solid rgba(212, 176, 76, 0.2)',
                            borderRadius: 999,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'primary.main', letterSpacing: '0.08em' }}>
                                {credits || 0} CREDITS
                            </Typography>
                        </Box>
                        <TextField
                            placeholder="Search assets..."
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{
                                width: { xs: '100%', sm: 260 },
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'rgba(15, 15, 15, 0.9)',
                                    borderRadius: 2.5
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 0.6,
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.08)',
                    bgcolor: 'rgba(12,12,12,0.6)'
                }}>
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            variant={category === cat ? 'contained' : 'text'}
                            sx={{
                                px: 2.2,
                                py: 0.6,
                                borderRadius: 999,
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                color: category === cat ? 'black' : 'text.secondary',
                                bgcolor: category === cat ? 'primary.main' : 'transparent',
                                minWidth: 'auto',
                                '&:hover': {
                                    bgcolor: category === cat ? 'primary.main' : 'rgba(255,255,255,0.06)',
                                }
                            }}
                        >
                            {cat}
                        </Button>
                    ))}
                </Box>
            </Box>

            <Grid container spacing={3}>
                {filteredApps.map((app) => (
                    <Grid item xs={12} sm={6} lg={4} key={app.id} sx={{ display: 'flex' }}>
                        <Card sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%', // Ensuring full width of grid item
                            bgcolor: 'rgba(16, 16, 16, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: 3,
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                borderColor: 'rgba(212, 176, 76, 0.6)',
                                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45)',
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
                                height: 230,
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
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                    {app.tags?.map((tag) => (
                                        <Box
                                            key={tag}
                                            sx={{
                                                px: 1.2,
                                                py: 0.35,
                                                borderRadius: 999,
                                                fontSize: '0.6rem',
                                                fontWeight: 700,
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                bgcolor: 'rgba(255,255,255,0.06)',
                                                color: 'text.secondary'
                                            }}
                                        >
                                            {tag}
                                        </Box>
                                    ))}
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.1, lineHeight: 1.25, fontSize: '1.05rem' }}>
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
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        color: 'text.primary',
                                        fontWeight: 700,
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
