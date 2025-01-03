import React from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete'; // Fixed import path
import SearchIcon from '@mui/icons-material/Search';
import AddImageModal from './AddImageModal';

function Gallery() {
  const [gallery, setGallery] = React.useState([]);
  const [orderBy, setOrderBy] = React.useState('name');
  const [order, setOrder] = React.useState('asc');
  const [selected, setSelected] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [imageToDelete, setImageToDelete] = React.useState(null);
  const [editingImage, setEditingImage] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchField, setSearchField] = React.useState('name');
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [customCategory, setCustomCategory] = React.useState('');

  const [formData, setFormData] = React.useState({
    name: '',
    finishName: '',
    finishImage: null
  });

  React.useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const typeName = "Gallery";
    const url = `http://localhost:5000/api/storage/type/${typeName}`;
    try {
      const response = await fetch(url, 
        { method: 'GET',
          credentials: 'include'},
      );
      if (!response.ok) throw new Error('Failed to fetch Gallery');
      const { data } = await response.json();
      setGallery(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
      setGallery([]); // Set empty array on error
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredGallery.map(image => image.id));
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

  const handleOpenDialog = (image = null) => {
    if (image) {
      setEditingImage(image);
      setFormData(image);
    } else {
      setEditingImage(null);
      setFormData({
        name: '',
        finishName: '',
        finishImage: null
      });
    }
    setOpenDialog(true);
  };

  const handleAddImage = (newImage) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('type', 'Gallery');
      formDataToSend.append('name', newImage.name);
      formDataToSend.append('file', newImage.finish[0].imageFile);
      
      const finishes = [{
        finish: newImage.finish[0].finishName,
        link: newImage.finish[0].imageUrl
      }];
      
      formDataToSend.append('finishes', JSON.stringify(finishes));

      console.log('Sending to API:', {
        type: 'Gallery',
        name: newImage.name,
        finishes: finishes,
        file: newImage.finish[0].imageFile
      });

      fetch("http://localhost:5000/api/storage/upload", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      })
      .then(response => {
        if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log('Upload successful:', data);
        fetchGallery();
        setOpenAddModal(false);
      })
      .catch(error => {
        console.error('Upload error:', error);
        alert('Failed to upload image. Please try again.');
      });
    } catch (error) {
      console.error('Error preparing upload:', error);
      alert('Error preparing image upload. Please try again.');
    }
  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      finishImage: event.target.files[0]
    });
  };

  const handleDeleteConfirm = async () => {
    if (imageToDelete) {
      await handleDelete(imageToDelete);
    } else {
      await handleDeleteSelected();
    }
    setOpenDeleteDialog(false);
    setImageToDelete(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/storage/product/${id}`,
        { credentials: 'include',
          method: 'DELETE',
        },
       );

      if (!response.ok) throw new Error('Failed to delete image from gallery');
      console.log("image deleted successfully from the gallery");
      fetchGallery(); 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selected.map(id => 
          fetch(`http://localhost:5000/api/storage/product/${id}`,
            { credentials: 'include',
              method: 'DELETE',
            },
            )
        )
      );
      console.log("Images deleted successfully from the gallery");
      fetchGallery(); 
      setSelected([]);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('finishName', formData.finishName);
      formDataToSend.append('finishImage', formData.finishImage);
      
      const response = await fetch(
        "http://localhost:5000/api/storage/upload",
        {
          method: "POST",
          credentials: "include",
          body: formDataToSend,
        }
      );
      if (!response.ok) throw new Error("Failed to add image");
      fetchGallery();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredGallery = Array.isArray(gallery) ? gallery.filter(image => {
    const searchValue = searchField === 'finishName' 
      ? (image.finishes[0]?.finish || '').toLowerCase()
      : (image[searchField] || '').toLowerCase();
    return searchValue.includes(searchQuery.toLowerCase());
  }) : [];

  const sortedGallery = filteredGallery.sort((a, b) => {
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
        <MenuItem value="finishName">Finish Name</MenuItem>
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
        {editingImage ? 'Edit Image' : 'Add New Image'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Finish Name"
            value={formData.finishName}
            onChange={(e) => setFormData({ ...formData, finishName: e.target.value })}
            required
          />
          <input
            accept="image/*"
            type="file"
            onChange={handleFileChange}
            style={{ margin: '10px 0' }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editingImage ? 'Save Changes' : 'Add Image'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderDeleteDialog = () => (
    <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {imageToDelete 
            ? 'Are you sure you want to delete this image from the gallery?' 
            : `Are you sure you want to delete ${selected.length} selected images from the gallery?`
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setOpenDeleteDialog(false);
          setImageToDelete(null);
        }}>
          Cancel
        </Button>
        <Button onClick={handleDeleteConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  const tableColumns = [
    { id: 'name', label: 'Name' },
    { id: 'finishName', label: 'Finish Name' },
    { id: 'image', label: 'Image' }
  ].map((column) => (
    <TableCell key={column.id}>
      <TableSortLabel
        active={orderBy === column.id}
        direction={orderBy === column.id ? order : 'asc'}
        onClick={() => handleSort(column.id)}
      >
        {column.label}
      </TableSortLabel>
    </TableCell>
  ));

  const renderTableBody = () => (
    <TableBody>
      {sortedGallery.map((image) => (
        <TableRow 
          key={image.id}
          selected={selected.includes(image.id)}
        >
          <TableCell padding="checkbox">
            <Checkbox
              checked={selected.includes(image.id)}
              onChange={() => handleSelect(image.id)}
            />
          </TableCell>
          <TableCell>{image.name}</TableCell>
          <TableCell>{image.finishes[0]?.finish || ''}</TableCell>
          <TableCell>
            {image.finishes[0]?.link && (
              <img 
                src={image.finishes[0].link} 
                alt={image.name} 
                style={{ height: '50px', width: 'auto' }}
              />
            )}
          </TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                size="small" 
                color="primary"
                onClick={() => handleOpenDialog(image)}
              >
                <EditIcon />
              </IconButton>
              <IconButton 
                size="small" 
                color="error"
                onClick={() => {
                  setImageToDelete(image.id);
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
            onClick={() => setOpenAddModal(true)}
            >
            Add New image to gallery
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
                  indeterminate={selected.length > 0 && selected.length < filteredGallery.length}
                  checked={selected.length === filteredGallery.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {tableColumns}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          {renderTableBody()}
        </Table>
      </TableContainer>

      {renderAddEditDialog()}
      {renderDeleteDialog()}
            
      <AddImageModal 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddImage}
        customCategory={customCategory}
        setCustomCategory={setCustomCategory}
      />
      
    </Box>
  );
}

export default Gallery;
