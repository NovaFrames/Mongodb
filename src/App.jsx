import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  AppBar,
  Toolbar,
  Avatar,
  Chip,
  Tooltip,
  InputAdornment,
  createTheme,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Fade,
  Alert,
  Snackbar
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Shield as ShieldIcon
} from "@mui/icons-material";
import * as api from "./api";

const App = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: "#1976d2",
          },
          secondary: {
            main: "#dc004e",
          },
          background: {
            default: prefersDarkMode ? "#0a1929" : "#f4f6f8",
            paper: prefersDarkMode ? "#001e3c" : "#ffffff",
          },
        },
        shape: {
          borderRadius: 12,
        },
        typography: {
          fontFamily: "'Inter', 'Roboto', sans-serif",
          h4: {
            fontWeight: 700,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 600,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [prefersDarkMode]
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      showSnackbar("Error fetching users", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.updateUser(editingUser._id, formData);
        showSnackbar("User updated successfully");
      } else {
        await api.createUser(formData);
        showSnackbar("User created successfully");
      }
      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({ name: "", email: "", role: "" });
      fetchUsers();
    } catch (error) {
      showSnackbar("Error saving user", "error");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.deleteUser(id);
        showSnackbar("User deleted successfully");
        fetchUsers();
      } catch (error) {
        showSnackbar("Error deleting user", "error");
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: "100vh" }}>
        <AppBar position="static" elevation={0} sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper", color: "text.primary" }}>
          <Toolbar>
            <ShieldIcon sx={{ mr: 2, color: "primary.main" }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: -0.5 }}>
              ADMIN PORTAL
            </Typography>
            <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32, fontSize: "0.875rem" }}>AD</Avatar>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ mb: 4 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                User Directory
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your team members and their access levels
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingUser(null);
                setFormData({ name: "", email: "", role: "" });
                setIsModalOpen(true);
              }}
              size="large"
              disableElevation
            >
              Add New User
            </Button>
          </Stack>

          <Card variant="outlined" sx={{ mb: 4 }}>
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                <TextField
                  fullWidth
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: 400 }}
                />
              </Box>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: prefersDarkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
                      <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar sx={{ bgcolor: "primary.light", fontWeight: "bold" }}>
                              {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <EmailIcon sx={{ fontSize: 12 }} />
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.primary">
                            {user.role || "Member"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="Active"
                            size="small"
                            color="success"
                            variant="soft"
                            sx={{
                              bgcolor: "success.lighter",
                              color: "white",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleEdit(user)} color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(user._id)} color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                          <Typography variant="body1" color="text.secondary">
                            No users found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Container>

        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="xs" TransitionComponent={Fade}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editingUser ? "Edit User Profile" : "Create New Profile"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <Stack spacing={3} sx={{ mt: 1 }}>
                <TextField
                  label="Full Name"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel>Workspace Role</InputLabel>
                  <Select
                    value={formData.role}
                    label="Workspace Role"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    startAdornment={
                      <InputAdornment position="start">
                        <WorkIcon fontSize="small" color="action" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">Select a role</MenuItem>
                    <MenuItem value="Admin">Administrator</MenuItem>
                    <MenuItem value="Member">Team Member</MenuItem>
                    <MenuItem value="Designer">Product Designer</MenuItem>
                    <MenuItem value="Developer">Software Engineer</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setIsModalOpen(false)} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disableElevation>
                {editingUser ? "Save Changes" : "Create User"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default App;
