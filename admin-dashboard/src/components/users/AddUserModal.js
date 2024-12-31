import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';

export default function AddUserModal({ 
  open, 
  onClose, 
  onSubmit, 
  editingUser, 
  formData, 
  setFormData 
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <TextField
            fullWidth
            label="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <TextField
            fullWidth
            label="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {editingUser ? "Save Changes" : "Add User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
