import React from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider,
    Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import SupportIcon from '@mui/icons-material/SupportAgent';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StorageIcon from '@mui/icons-material/Storage';
import AppsIcon from '@mui/icons-material/Apps';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import MapIcon from '@mui/icons-material/Map';
import RuleIcon from '@mui/icons-material/Rule';
import MovieIcon from '@mui/icons-material/Movie';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';

import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 260;

const Sidebar = ({ setIsLoggedIn }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'N';
    const userInitial = username.charAt(0).toUpperCase();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('credits');
        if (setIsLoggedIn) setIsLoggedIn(false);
        navigate('/login');
    };

    const menuItems = [
        { text: 'Projects', icon: <AssignmentIcon />, path: '/projects' },
        { text: 'MOT', icon: <StorageIcon />, path: '/mot' },
        { text: 'Apps Library', icon: <AppsIcon />, path: '/' },
        { text: 'Design Tool', icon: <DesignServicesIcon />, path: '/design-tool' },
        { text: '2D to 3D', icon: <ThreeDRotationIcon />, path: '/2d-to-3d' },
        { text: 'Elevation & Sections', icon: <ViewQuiltIcon />, path: '/elevation' },
        { text: 'Vacant Land', icon: <MapIcon />, path: '/land' },
        { text: 'Code Check', icon: <RuleIcon />, path: '/code-check' },
        { text: '3D Video', icon: <MovieIcon />, path: '/3d-video' },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, mt: 1, px: 2 }}>
                <Box sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Typography sx={{ fontWeight: 900, color: 'black', fontSize: '1.2rem' }}>A</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '2px', color: 'primary.main', fontSize: '1.1rem' }}>
                    ARCONE
                </Typography>
            </Box>

            <List sx={{ flexGrow: 1, px: 0 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            component={NavLink}
                            to={item.path}
                            sx={{
                                borderRadius: 2,
                                py: 1.5,
                                '&.active': {
                                    bgcolor: 'rgba(212, 176, 76, 0.12)',
                                    color: 'primary.main',
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.main',
                                    },
                                },
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontWeight: 600,
                                    fontSize: '0.85rem'
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.05)' }} />

            <Box sx={{ px: 2, pb: 2 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 2,
                        py: 1.5,
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar
                            sx={{
                                width: 28,
                                height: 28,
                                bgcolor: 'transparent',
                                border: '1px solid',
                                borderColor: 'text.secondary',
                                fontSize: '0.8rem',
                                color: 'text.secondary'
                            }}
                        >
                            {userInitial}
                        </Avatar>
                    </ListItemIcon>
                    <ListItemText
                        primary="Sign Out"
                        primaryTypographyProps={{
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            color: 'text.secondary'
                        }}
                    />
                </ListItemButton>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
