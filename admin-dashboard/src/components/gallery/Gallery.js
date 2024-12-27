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

const sampleGalleryItems = [
  {
    id: 'IMG001',
    name: 'Project Image 1',
    dateAdded: '2024-01-15',
    thumbnail: 'https://via.placeholder.com/150',
  },
  {
    id: 'IMG002',
    name: 'Project Image 2',
    dateAdded: '2024-01-16',
    thumbnail: 'https://via.placeholder.com/150',
  },
  {
    id: 'IMG003',
    name: 'Project Image 3',
    dateAdded: '2024-01-17',
    thumbnail: 'https://via.placeholder.com/150',
  }
];

export default function Gallery() {
  const [items, setItems] = useState(sampleGalleryItems);
  const [orderBy, setOrderBy] = useState('dateAdded');
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    dateAdded: new Date().toISOString().split('T')[0],
    thumbnail: '',
    imageFile: null
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('name');

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(items.map(item => item.id));
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

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        id: `IMG${String(items.length + 1).padStart(3, '0')}`,
        name: '',
        dateAdded: new Date().toISOString().split('T')[0],
        thumbnail: '',
        imageFile: null
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = () => {
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id ? formData : item
      ));
    } else {
      setItems([...items, formData]);
    }
    setOpenDialog(false);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setItems(items.filter(item => item.id !== itemToDelete));
    } else {
      setItems(items.filter(item => !selected.includes(item.id)));
      setSelected([]);
    }
    setOpenDeleteDialog(false);
    setItemToDelete(null);
  };

  const sortedItems = [...items].sort((a, b) => {
    const isAsc = order === 'asc';
    if (a[orderBy] < b[orderBy]) return isAsc ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return isAsc ? 1 : -1;
    return 0;
  });

  const filteredItems = sortedItems.filter(item => {
    const searchValue = item[searchField].toLowerCase();
    return searchValue.includes(searchQuery.toLowerCase());
  });

  // Add Modal Component (inline)
  const renderAddEditDialog = () => (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle>
        {editingItem ? 'Edit Image' : 'Add New Image'}
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
            type="date"
            label="Date Added"
            value={formData.dateAdded}
            onChange={(e) => setFormData({ ...formData, dateAdded: e.target.value })}
            InputLabelProps={{ shrink: true }}
            required
          />
          <input
            accept="image/*"
            type="file"
            id="gallery-image-upload"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setFormData({
                  ...formData,
                  imageFile: file,
                  thumbnail: URL.createObjectURL(file)
                });
              }
            }}
          />
          <label htmlFor="gallery-image-upload">
            <Button variant="outlined" component="span" fullWidth>
              Upload Image
            </Button>
          </label>
          {formData.thumbnail && (
            <Box sx={{ width: 200, height: 200, margin: '0 auto' }}>
              <img
                src={formData.thumbnail}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editingItem ? 'Save Changes' : 'Add Image'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Delete Confirmation Dialog (inline)
  const renderDeleteDialog = () => (
    <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {itemToDelete 
            ? 'Are you sure you want to delete this image?' 
            : `Are you sure you want to delete ${selected.length} selected images?`
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setOpenDeleteDialog(false);
          setItemToDelete(null);
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
        <Typography variant="h4">Gallery</Typography>
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
            Add New Image
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="id">ID</MenuItem>
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < items.length}
                  checked={selected.length === items.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {['id', 'thumbnail', 'name', 'dateAdded'].map((field) => (
                <TableCell key={field}>
                  {field === 'thumbnail' ? (
                    'Thumbnail'
                  ) : (
                    <TableSortLabel
                      active={orderBy === field}
                      direction={orderBy === field ? order : 'asc'}
                      onClick={() => handleSort(field)}
                    >
                      {field === 'dateAdded' ? 'Date Added' : field.charAt(0).toUpperCase() + field.slice(1)}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow 
                key={item.id}
                selected={selected.includes(item.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(item.id)}
                    onChange={() => handleSelect(item.id)}
                  />
                </TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <Box
                    component="img"
                    src={item.thumbnail}
                    alt={item.name}
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.dateAdded}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenDialog(item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => {
                        setItemToDelete(item.id);
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
