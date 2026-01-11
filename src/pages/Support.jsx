import { Container, Typography, Box, Paper, Button, TextField } from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const Support = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <SupportAgentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h4" fontWeight={800}>Support Center</Typography>
                    <Typography color="text.secondary">How can we help you today?</Typography>
                </Box>

                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600, mx: 'auto' }}>
                    <TextField label="Subject" fullWidth variant="outlined" />
                    <TextField label="Message" fullWidth multiline rows={4} variant="outlined" />
                    <Button variant="contained" size="large" disableElevation sx={{ py: 1.5 }}>
                        Submit Ticket
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Support;
