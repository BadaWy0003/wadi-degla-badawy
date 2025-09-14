const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Function to convert product name to URL-friendly format
const toUrlFriendly = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

async function generateRoutes() {
  try {
    // Connect to MongoDB directly
    await mongoose.connect('mongodb://localhost:27017/wadidegla', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Get the Product model
    const Product = mongoose.model('Product', new mongoose.Schema({
      name: String
    }));

    // Fetch all products
    const products = await Product.find({}, 'name');

    // Generate product routes
    const productRoutes = products.map(product => `/products/${toUrlFriendly(product.name)}`);

    // Base routes that should always be included
    const baseRoutes = [
      "/",
      "/products",
      "/about",
      "/gallery",
      "/contact",
      "/quarries",
      "/exports",
      "/machinery",
      "/history",
      "/partners",
      "/news",
      "/projects",
      "/fairs",
      "/patterns",
      "/certificates",
      "/Stone Creations",
      "/Cobbles",
      "/kerbstone",
      "/visualizer",
      "/inspiration"
    ];

    // Combine base routes with product routes
    const allRoutes = [...baseRoutes, ...productRoutes];

    // Read the current package.json
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = require(packageJsonPath);

    // Update package.json
    packageJson.reactSnap = {
      ...packageJson.reactSnap,
      routes: allRoutes
    };

    // Write back to package.json
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      'utf8'
    );

    console.log('Routes generated successfully!');
    console.log('Total routes:', allRoutes.length);
    console.log('Product routes:', productRoutes);

    // Close the MongoDB connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error generating routes:', error);
    process.exit(1);
  }
}

generateRoutes();
