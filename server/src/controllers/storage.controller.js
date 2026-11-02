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
    const finishesWithoutFile = finishesArray.filter((f) => !f.link);

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

    // Fetch materials from the service
    const materials = await StorageService.fetchMaterialsByType(type);

    res.status(200).json({ message: 'Materials fetched successfully', data: materials , totalCount: materials.length});
  } catch (error) {
    console.error('Error in getMaterialsByType:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

StorageController.getAllProducts = async (req, res) => {
  try {
    // Fetch all materials from the service
    const products = await StorageService.fetchAllProducts();
    res.status(200).json({ message: 'Products fetched successfully', data: products , totalCount: products.length });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Admin panel list: includes hidden products (each has hidden: true).
StorageController.getAllForAdmin = async (req, res) => {
  try {
    const products = await StorageService.fetchAllProducts({ includeHidden: true });
    res.status(200).json({ message: 'Products fetched successfully', data: products, totalCount: products.length });
  } catch (error) {
    console.error('Error in getAllForAdmin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Hide a product from the website, or show it again ({ hidden: true | false }).
StorageController.setProductHidden = async (req, res) => {
  const { hidden } = req.body || {};
  if (typeof hidden !== 'boolean') {
    return res.status(400).json({ message: 'hidden must be true or false' });
  }
  try {
    const data = await StorageService.setProductHidden(req.params.id, hidden);
    res.status(200).json({ message: hidden ? 'Product hidden' : 'Product visible', data });
  } catch (error) {
    console.error('Error changing product visibility:', error.message);
    res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : 'Internal server error' });
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
    res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Failed to delete product',
    });
  }
};

module.exports = StorageController;

