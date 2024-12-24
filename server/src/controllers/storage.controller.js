const StorageController = {};
const StorageService = require('../services/storage.service');

StorageController.uploadMaterial = async (req, res) => {
  try {
    const { name, type, finish } = req.body;
    const file = req.file;

    if (!name || !type || !finish || !file) {
      return res.status(400).json({
        message: 'Missing required fields: name, type, finish, or file',
      });
    }

    const response = await StorageService.handleMaterialUpload({ name, type, finish, file });
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in uploadMaterial:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

module.exports = StorageController;
