import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';

const AddImageModal = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    finishName: '',
    imageFile: null,
    imageUrl: null
  });

  useEffect(() => {
    return () => {
      if (formData.imageUrl) {
        URL.revokeObjectURL(formData.imageUrl);
      }
    };
  }, [formData.imageUrl]);

  useEffect(() => {
    if (!open) {
      if (formData.imageUrl) {
        URL.revokeObjectURL(formData.imageUrl);
      }
      setFormData({
        finishName: '',
        imageFile: null,
        imageUrl: null
      });
    }
  }, [open, formData.imageUrl]); // Add formData.imageUrl to dependencies

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (formData.imageUrl) {
        URL.revokeObjectURL(formData.imageUrl);
      }
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: imageUrl
      }));
    }
  };

  const handleSubmit = () => {
    const submissionData = {
      name: formData.finishName,
      finish: [{
        finishName: formData.finishName,
        imageFile: formData.imageFile,
        imageUrl: formData.imageUrl
      }]
    };
    
    if (!formData.imageFile) {
      alert('Please select an image file');
      return;
    }
    
    onAdd(submissionData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Image</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={formData.finishName}
            onChange={(e) => setFormData(prev => ({ ...prev, finishName: e.target.value }))}
            required
          />
          <input
            accept="image/*"
            type="file"
            onChange={handleImageUpload}
            style={{ margin: '10px 0' }}
          />
          {formData.imageUrl && (
            <img 
              src={formData.imageUrl} 
              alt="Preview" 
              style={{ maxHeight: 200, objectFit: 'contain' }}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!formData.finishName || !formData.imageFile}
        >
          Add Image
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddImageModal;
