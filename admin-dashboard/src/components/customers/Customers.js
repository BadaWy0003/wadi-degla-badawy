import { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

const sampleCustomers = [
  {
    id: 'CUST001',
    name: 'John Smith',
    email: 'john@company.com',
    company: 'Tech Corp',
  },
  {
    id: 'CUST002',
    name: 'Sarah Wilson',
    email: 'sarah@enterprise.com',
    company: 'Enterprise Ltd',
  },
  {
    id: 'CUST003',
    name: 'Mike Brown',
    email: 'mike@business.com',
    company: 'Business Inc',
  },
];

export default function Customers() {
  const [customers, setCustomers] = useState(sampleCustomers);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    company: '',
  });

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredCustomers.map(customer => customer.id));
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

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData(customer);
    } else {
      setEditingCustomer(null);
      setFormData({
        id: `CUST${String(customers.length + 1).padStart(3, '0')}`,
        name: '',
        email: '',
        company: '',
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = () => {
    if (editingCustomer) {
      setCustomers(customers.map(customer => 
        customer.id === editingCustomer.id ? formData : customer
      ));
    } else {
      setCustomers([...customers, formData]);
    }
    setOpenDialog(false);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      setCustomers(customers.filter(customer => customer.id !== customerToDelete));
    } else {
      setCustomers(customers.filter(customer => !selected.includes(customer.id)));
      setSelected([]);
    }
    setOpenDeleteDialog(false);
    setCustomerToDelete(null);
  };

  const filteredCustomers = customers.filter(customer => {
    const searchValue = customer[searchField].toLowerCase();
    return searchValue.includes(searchQuery.toLowerCase());
  });

  const sortedCustomers = filteredCustomers.sort((a, b) => {
    const isAsc = order === 'asc';
    if (a[orderBy] < b[orderBy]) return isAsc ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return isAsc ? 1 : -1;
    return 0;
  });

  const renderSearchBar = () => (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <TextField
        select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        sx={{ width: 150 }}
      >
        <MenuItem value="name">Name</MenuItem>
        <MenuItem value="id">ID</MenuItem>
        <MenuItem value="email">Email</MenuItem>
        <MenuItem value="company">Company</MenuItem>
      </TextField>
      <TextField
        fullWidth
        placeholder={`Search by ${searchField}...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );

  const renderAddEditDialog = () => (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle>
        {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="ID"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editingCustomer ? 'Save Changes' : 'Add Customer'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderDeleteDialog = () => (
    <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {customerToDelete 
            ? 'Are you sure you want to delete this customer?' 
            : `Are you sure you want to delete ${selected.length} selected customers?`
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setOpenDeleteDialog(false);
          setCustomerToDelete(null);
        }}>
          Cancel
        </Button>
        <Button onClick={handleDeleteConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Customers</Typography>
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
            Add New Customer
          </Button>
        </Box>
      </Box>

      {renderSearchBar()}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < filteredCustomers.length}
                  checked={selected.length === filteredCustomers.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {['id', 'name', 'email', 'company'].map((field) => (
                <TableCell key={field}>
                  <TableSortLabel
                    active={orderBy === field}
                    direction={orderBy === field ? order : 'asc'}
                    onClick={() => handleSort(field)}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCustomers.map((customer) => (
              <TableRow 
                key={customer.id}
                selected={selected.includes(customer.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(customer.id)}
                    onChange={() => handleSelect(customer.id)}
                  />
                </TableCell>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.company}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenDialog(customer)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => {
                        setCustomerToDelete(customer.id);
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

      {renderAddEditDialog()}
      {renderDeleteDialog()}
    </Box>
  );
}
