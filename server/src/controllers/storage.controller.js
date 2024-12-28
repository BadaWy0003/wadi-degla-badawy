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

StorageController.getMaterialsByType = async (req, res) => {
  try {
    const { type } = req.params; // Get the material type from the route parameters

    if (!type) {
      return res.status(400).json({ message: 'Type parameter is required' });
    }

    // Fetch materials from the service
    const materials = await StorageService.fetchMaterialsByType(type);

    res.status(200).json({ message: 'Materials fetched successfully', data: materials });
  } catch (error) {
    console.error('Error in getMaterialsByType:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

StorageController.getAllProducts = async (req, res) => {
  try {
    // Fetch all materials from the service
    const products = await StorageService.fetchAllProducts();

    res.status(200).json({ message: 'Products fetched successfully', data: products });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

module.exports = StorageController;
