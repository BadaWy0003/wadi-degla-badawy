const StorageController = {};
const StorageService = require('../services/storage.service');

StorageController.uploadMaterial = async (req, res) => {
  try {
    const { name, type, finishes } = req.body; // `finishes` is expected as a JSON string.
    const files = req.files;
    console.log('Files:', typeof files);
    if (!name || !type || !finishes || files.length === 0) {
      return res.status(400).json({
        message: 'Missing required fields: name, type, finishes, or files',
      });
    }
    console.log('Missing required fields:', req.files, req.body);
    const finishesArray = JSON.parse(finishes); // Parse finishes string into an array.

    if (finishesArray.length !== files.length) {
      return res.status(400).json({
        message: 'The number of finishes does not match the number of uploaded files',
      });
    }

    const response = await StorageService.handleMaterialUpload({
      name,
      type,
      finishes: finishesArray,
      files,
    });

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

StorageController.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Call service to delete product
    await StorageService.deleteProduct(id);

    res.status(200).json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};

module.exports = StorageController;
