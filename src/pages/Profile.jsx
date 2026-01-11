import { Container, Typography, Box, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const Profile = () => {
    const username = localStorage.getItem('username') || 'User';

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Box sx={{
                        p: 2,
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex'
                    }}>
                        <PersonIcon fontSize="large" />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={800}>{username}</Typography>
                        <Typography color="text.secondary">Arcone Member since 2024</Typography>
                    </Box>
                </Box>
                <Typography variant="h6" gutterBottom>Account Security</Typography>
                <Typography color="text.secondary">Your account is secured with end-to-end encryption.</Typography>
            </Paper>
        </Container>
    );
};

export default Profile;
