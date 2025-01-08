import { useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const PREDEFINED_CATEGORIES = [
  'Egyptian Marble',
  'Egyptian Granite',
  'Imported Marble',
  'Imported Granite'
];

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
  { label: 'Indoor Mockup', value: 'indoorMockup' },
  { label: 'Outdoor Mockup', value: 'outdoorMockup' },
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

export default function AddProductModal({ open, onClose, onSubmit }) {
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isCustomFinish, setIsCustomFinish] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [customFinish, setCustomFinish] = useState('');
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    finish: [],
    mockup: '',
    mockupOutdoor: '',
    file: '',
  });

  const [newFinish, setNewFinish] = useState({
    finishName: '',
    imageUrl: '',
    imageFile: null,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
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

  const handleCustomCategoryChange = (e) => {
    const value = e.target.value;
    setCustomCategory(value);
    setProductData(prev => ({ ...prev, category: value }));
  };

  const handleFinishNameChange = (e) => {
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

  const handleCustomFinishChange = (e) => {
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
          imageUrl: URL.createObjectURL(file)
        }));
      } else {
        setProductData(prev => ({
          ...prev,
          [type]: file, // Store the actual file instead of URL
          [`${type}Preview`]: URL.createObjectURL(file) // Store URL separately for preview
        }));
      }
    }
  };

  const handleFinishAdd = () => {
    if (newFinish.finishName && (newFinish.imageUrl || newFinish.imageFile)) {
      setProductData(prev => ({
        ...prev,
        finish: [...prev.finish, {
          finishName: newFinish.finishName,
          imageUrl: newFinish.imageUrl,
          imageFile: newFinish.imageFile
        }]
      }));
      setNewFinish({ finishName: '', imageUrl: '', imageFile: null });
      setErrors(prev => ({ ...prev, finish: '' }));
    }
  };

  const handleFinishRemove = (index) => {
    setProductData(prev => ({
      ...prev,
      finish: prev.finish.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // if (!productData.id) {
    //   newErrors.id = 'ID is required';
    // }

    if (productData.finish.length === 0) {
      newErrors.finish = 'At least one finish with an image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formData = new FormData();

        // Add the file
        if (productData.mockup) {
          console.log('Adding mockup file:', productData.mockup);
          formData.append('files', productData.mockup);
        }
        console.log(productData);
        if (productData.finish.length) {
          productData.finish.forEach((finish) => { formData.append('files', finish.imageFile); });
        }
        console.log(productData.finish[0].imageFile);
        // Add other fields
        formData.append('name', productData.name);
        formData.append('type', productData.category);

        // Convert finishes array to string and add
        const finishesData = productData.finish.map((f) => ({
          finishName: f.finishName,
        }));
        formData.append("finishes", JSON.stringify(finishesData));
        console.log(formData.get("finishes"));
        // Log formData contents for debugging
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        // Send the POST request
        const response = await fetch(
          `${process.env.REACT_APP_BASE_API_URL}/api/storage/upload`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Upload failed');
        }

        console.log('Upload successful:', result);
        onSubmit(productData);
        handleReset();
        onClose();
      } catch (error) {
        console.error('Error uploading product:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.message || 'Failed to upload product. Please try again.'
        }));
      }
    }
  };

  const handleReset = () => {
    setProductData({
      name: '',
      category: '',
      finish: [],
      mockup: '',
      mockupOutdoor: '',
    });
    setNewFinish({
      finishName: '',
      imageUrl: '',
      imageFile: null,
    });
    setIsCustomCategory(false);
    setCustomCategory('');
    setErrors({});
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2 }}>Add New Product</Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} >
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              required
            />
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
                  native: false
                }}
              >
                {PREDEFINED_CATEGORIES.map((category) => (
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
                  sx={{ minWidth: 200 }}  // Add this line to fix width
                  SelectProps={{
                    native: false
                  }}
                >
                  {PREDEFINED_FINISHES.map((finish) => (
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
                    sx={{ minWidth: 200 }}  // Add this line to fix width
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
                onChange={(e) => handleImageUpload(e, 'finish')}
              />
              <label htmlFor="finish-image-upload">
                <Button variant="outlined" component="span" size="small">
                  Upload Image
                </Button>
              </label>
              {newFinish.imageUrl && (
                <Box sx={{ width: 50, height: 50 }}>
                  <img
                    src={newFinish.imageUrl}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              )}
              <IconButton color="primary" onClick={handleFinishAdd}>
                <AddIcon />
              </IconButton>
            </Box>

            {productData.finish.map((finish, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography>{finish.finishName}</Typography>
                {finish.imageUrl && (
                  <Box sx={{ width: 50, height: 50 }}>
                    <img
                      src={finish.imageUrl}
                      alt={finish.finishName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
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
              <Button onClick={handleReset} color="secondary">
                Reset Form
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Add Product
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
