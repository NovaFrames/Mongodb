import { Container, Typography, Box, Paper, Switch, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';

const Settings = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h4" fontWeight={800} gutterBottom>Settings</Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>Manage your account preferences and system settings.</Typography>

                <List>
                    <ListItem divider>
                        <ListItemText primary="Email Notifications" secondary="Receive updates via email" />
                        <ListItemSecondaryAction>
                            <Switch defaultChecked color="primary" />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary="Two-Factor Authentication" secondary="Increase account security" />
                        <ListItemSecondaryAction>
                            <Switch color="primary" />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Dark Mode" secondary="Switch between light and dark themes" />
                        <ListItemSecondaryAction>
                            <Switch disabled />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Paper>
        </Container>
    );
};

export default Settings;
