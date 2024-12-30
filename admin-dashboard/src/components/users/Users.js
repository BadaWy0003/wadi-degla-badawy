import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Typography,
  Button,
  IconButton,
  Checkbox,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddUserModal from './AddUserModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { useGlobalState } from "../GlobalStateContext"; // Ensure this exists



export default function Users() {
  const [users, setUsers] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { globalState } = useGlobalState();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
  });
  const [selected, setSelected] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    const token = globalState.token;
    try {
      const response = await fetch('http://localhost:5000/api/admin/all',
      { withCredentials: true }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error! Status: ${response.status}, Body: ${errorText}`);
      }

      const data = await response.json();
      setUsers(data.map(user => ({
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
      })));
    } catch (error) {
      console.error('Failed to fetch users:', error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedUsers = [...users].sort((a, b) => {
      if (a[property] < b[property]) return order === 'asc' ? -1 : 1;
      if (a[property] > b[property]) return order === 'asc' ? 1 : -1;
      return 0;
    });

    setUsers(sortedUsers);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(users.map(user => user.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter(item => item !== id);
    }

    setSelected(newSelected);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      handleDelete(userToDelete);
    } else {
      handleDeleteSelected();
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        id: `USR${String(users.length + 1).padStart(3, '0')}`,
        name: '',
        email: '',
        role: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({ id: '', name: '', email: '', role: '' });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/create',
      { withCredentials: true },
       {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${globalState.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create user');
      
      fetchUsers(); // Now fetchUsers is in scope
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete/${id}`,
       { withCredentials: true },
       {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${globalState.token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete user');
      
      fetchUsers(); // Now fetchUsers is in scope
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selected.map(id => 
          fetch(`http://localhost:5000/api/admin/delete/${id}`,
          { withCredentials: true },
           {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${globalState.token}`
            }
          })
        )
      );
      
      fetchUsers(); // Now fetchUsers is in scope
      setSelected([]);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Users</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {selected.length > 0 && (
            <Button 
              variant="contained" 
              color="error"
              onClick={() => setOpenDeleteDialog(true)}
            >
              Delete Selected ({selected.length})
            </Button>
          )}
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Add New User
          </Button>
        </Box>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < users.length}
                  checked={selected.length === users.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleSort('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'role'}
                  direction={orderBy === 'role' ? order : 'asc'}
                  onClick={() => handleSort('role')}
                >
                  Role
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id}
                selected={selected.includes(user.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(user.id)}
                    onChange={() => handleSelect(user.id)}
                  />
                </TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenDialog(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => {
                        setUserToDelete(user.id);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddUserModal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleSubmit}
        editingUser={editingUser}
        formData={formData}
        setFormData={setFormData}
      />

      <DeleteConfirmDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        singleDelete={!!userToDelete}
        count={selected.length}
      />
    </Box>
  );
}
