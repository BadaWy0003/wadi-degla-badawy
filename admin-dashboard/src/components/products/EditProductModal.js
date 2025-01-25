import { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Grid, IconButton, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import apiClient from '../../util/client';

const PREDEFINED_CATEGORIES = ['Egyptian Marble', 'Egyptian Granite', 'Imported Marble', 'Imported Granite'];

const PREDEFINED_FINISHES = [
  { label: 'Polished', value: 'Polished' },
  { label: 'Antique', value: 'Antique' },
  { label: 'Brushed', value: 'Brushed' },
  { label: 'Bush Hammered', value: 'Bush Hammered' },
  { label: 'Flamed', value: 'Flamed' },
  { label: 'Honed', value: 'Honed' },
  { label: 'Leather', value: 'Leather' },
  { label: 'Rough', value: 'Rough' },
  { label: 'Sand blasted', value: 'Sand blasted' },
  { label: 'Split Face', value: 'Split Face' },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

export default function EditProductModal({ open, onClose, onSubmit, product }) {
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isCustomFinish, setIsCustomFinish] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [customFinish, setCustomFinish] = useState('');
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    finish: [],
  });

  const [newFinish, setNewFinish] = useState({
    id: Date.now(), // Unique ID for each finish
    finishName: '',
    imageUrl: '',
    imageFile: null,
  });

  const [errors, setErrors] = useState({});

  // Initialize form with existing product data
  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name,
        category: product.type,
        finish: product.finishes.map(f => ({
          id: Date.now(), // Assign a unique ID to each existing finish
          finishName: f.finish,
          imageUrl: f.link,
          existingImage: true, // Flag to identify existing images
        })),
      });

      // Check if category is custom
      if (!PREDEFINED_CATEGORIES.includes(product.type)) {
        setIsCustomCategory(true);
        setCustomCategory(product.type);
      }
    }
  }, [product]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    if (name === 'category') {
      if (value === 'custom') {
        setIsCustomCategory(true);
        setCustomCategory('');
      } else {
        setIsCustomCategory(false);
        setProductData(prev => ({ ...prev, category: value }));
      }
    } else {
      setProductData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomCategoryChange = e => {
    const value = e.target.value;
    setCustomCategory(value);
    setProductData(prev => ({ ...prev, category: value }));
  };

  const handleFinishNameChange = e => {
    const value = e.target.value;
    if (value === 'custom') {
      setIsCustomFinish(true);
      setCustomFinish('');
      setNewFinish(prev => ({ ...prev, finishName: '' }));
    } else {
      setIsCustomFinish(false);
      setNewFinish(prev => ({ ...prev, finishName: value }));
    }
  };

  const handleCustomFinishChange = e => {
    const value = e.target.value;
    setCustomFinish(value);
    setNewFinish(prev => ({ ...prev, finishName: value }));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'finish') {
        setNewFinish(prev => ({
          ...prev,
          imageFile: file,
          imageUrl: URL.createObjectURL(file),
        }));
      }
    }
  };

  const handleFinishAdd = () => {
    if (newFinish.finishName && (newFinish.imageUrl || newFinish.imageFile)) {
      setProductData(prev => ({
        ...prev,
        finish: [
          ...prev.finish,
          {
            id: newFinish.id, // Use unique ID
            finishName: newFinish.finishName,
            imageUrl: newFinish.imageUrl,
            imageFile: newFinish.imageFile,
          },
        ],
      }));
      setNewFinish({ id: Date.now(), finishName: '', imageUrl: '', imageFile: null });
      setErrors(prev => ({ ...prev, finish: '' }));
    }
  };

  const handleFinishRemove = index => {
    setProductData(prev => ({
      ...prev,
      finish: prev.finish.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (productData.finish.length === 0) {
      newErrors.finish = 'At least one finish with an image is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formData = new FormData();

        // Add base fields
        formData.append('name', productData.name);
        formData.append('type', productData.category);

        // Add files for each finish
        productData.finish.forEach((finish, index) => {
          if (finish.imageFile) {
            formData.append(`finish_${index}_image`, finish.imageFile);
          }
        });

        // Add finishes data
        const finishesData = productData.finish.map(f => ({
          finishName: f.finishName,
          // Preserve existing image links where available
          link: f.existingImage ? f.imageUrl : undefined, // Preserve existing image links
        }));

        formData.append('finishes', JSON.stringify(finishesData));

        await apiClient.put(`/api/storage/product/${product.id}`, formData);

        onSubmit();
        onClose();
      } catch (error) {
        console.error('Error updating product:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.message || 'Failed to update product. Please try again.',
        }));
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Edit Product
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Product Name" name="name" value={productData.name} onChange={handleInputChange} required />
          </Grid>

          <Grid item xs={12}>
            {!isCustomCategory ? (
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={productData.category}
                onChange={handleInputChange}
                required
                select
                SelectProps={{
                  native: false,
                }}
              >
                {PREDEFINED_CATEGORIES.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
                <MenuItem value="custom">
                  <em>Custom category...</em>
                </MenuItem>
              </TextField>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Custom Category"
                  value={customCategory}
                  onChange={handleCustomCategoryChange}
                  required
                  placeholder="Enter custom category name"
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setIsCustomCategory(false);
                    setCustomCategory('');
                    setProductData(prev => ({ ...prev, category: '' }));
                  }}
                >
                  Back to Categories
                </Button>
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Finishes
              {errors.finish && (
                <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                  {errors.finish}
                </Typography>
              )}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {!isCustomFinish ? (
                <TextField
                  size="small"
                  label="Finish Name"
                  value={newFinish.finishName}
                  onChange={handleFinishNameChange}
                  select
                  sx={{ minWidth: 200 }}
                  SelectProps={{
                    native: false,
                  }}
                >
                  {PREDEFINED_FINISHES.map(finish => (
                    <MenuItem key={finish.value} value={finish.value}>
                      {finish.label}
                    </MenuItem>
                  ))}
                  <MenuItem value="custom">
                    <em>Custom finish...</em>
                  </MenuItem>
                </TextField>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    label="Custom Finish"
                    value={customFinish}
                    onChange={handleCustomFinishChange}
                    required
                    placeholder="Enter custom finish name"
                    sx={{ minWidth: 200 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setIsCustomFinish(false);
                      setCustomFinish('');
                      setNewFinish(prev => ({ ...prev, finishName: '' }));
                    }}
                  >
                    Back to Finishes
                  </Button>
                </Box>
              )}
              <input
                accept="image/*"
                type="file"
                id="finish-image-upload"
                style={{ display: 'none' }}
                onChange={e => handleImageUpload(e, 'finish')}
              />
              <label htmlFor="finish-image-upload">
                <Button variant="outlined" component="span" size="small">
                  Upload Image
                </Button>
              </label>
              {newFinish.imageUrl && (
                <Box sx={{ width: 50, height: 50 }}>
                  <img src={newFinish.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              )}
              <IconButton color="primary" onClick={handleFinishAdd}>
                <AddIcon />
              </IconButton>
            </Box>

            {productData.finish.map((finish, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography>{finish.finishName}</Typography>
                {(finish.imageUrl || finish.link) && (
                  <Box sx={{ width: 50, height: 50 }}>
                    <img src={finish.imageUrl || finish.link} alt={finish.finishName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                )}
                <IconButton size="small" color="error" onClick={() => handleFinishRemove(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Update Product
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
