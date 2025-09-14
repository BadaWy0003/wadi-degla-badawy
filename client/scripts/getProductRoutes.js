const axios = require('axios');

// Function to convert product name to URL-friendly format
const toUrlFriendly = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

async function getProductRoutes() {
  try {
    // Make API call to fetch all products
    const response = await axios.get('http://localhost:3001/api/storage/all');
    const products = response.data.data;

    // Extract and format product names into routes
    const productRoutes = products.map(product => `/products/${toUrlFriendly(product.name)}`);

    // Print the routes in a format ready to paste into package.json
    console.log('Product Routes:');
    console.log(JSON.stringify(productRoutes, null, 2));
    console.log('\nTotal number of product routes:', productRoutes.length);

  } catch (error) {
    console.error('Error fetching products:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the function
getProductRoutes();
