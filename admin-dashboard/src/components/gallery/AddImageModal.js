import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import imageCompression from 'browser-image-compression';

const AddImageModal = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    finishName: '',
    imageFile: null,
    imageUrl: null,
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
        imageUrl: null,
      });
    }
  }, [open, formData.imageUrl]); // Add formData.imageUrl to dependencies

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      if (formData.imageUrl) {
        URL.revokeObjectURL(formData.imageUrl);
      }
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: imageUrl,
      }));
    }
  };

const handleSubmit = async () => {
  if (!formData.imageFile) {
    alert('Please select an image file');
    return;
  }

  try {
    const options = {
      maxWidthOrHeight: 1600,
      initialQuality: 0.82,
      useWebWorker: true,
      fileType: 'image/webp',
    };

    const compressedFile = await imageCompression(formData.imageFile, options);

    const submissionData = {
      name: formData.finishName,
      finishes: [
        {
          finish: formData.finishName,
          link: URL.createObjectURL(compressedFile),
          imageFile: compressedFile,
        },
      ],
    };

    onAdd(submissionData);
  } catch (error) {
    console.error('Image compression error:', error);
    alert('Image optimization failed. Please try again.');
  }
};

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add photos</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={formData.finishName}
            onChange={e => setFormData(prev => ({ ...prev, finishName: e.target.value }))}
            required
          />
          <input accept="image/*" type="file" onChange={handleImageUpload} style={{ margin: '10px 0' }} />
          {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" style={{ maxHeight: 200, objectFit: 'contain' }} />}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!formData.finishName || !formData.imageFile}>
          Add Image
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddImageModal;
