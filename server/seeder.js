const mongoose = require('mongoose');
const Product = require('./models/Product');
const products = require('./data/products');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const generateSKU = (product, index) => {
  const category = product.category.substring(0, 3).toUpperCase();
  const brand = product.brand.substring(0, 3).toUpperCase();
  const number = String(index + 1).padStart(4, '0');
  return `${category}-${brand}-${number}`;
};

const importData = async () => {
  try {
    // Clear existing products
    await Product.deleteMany();

    // Add slug and SKU to each product
    const productsWithSlugAndSKU = products.map((product, index) => {
      const slug = product.name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      const sku = generateSKU(product, index);
      return { ...product, slug, sku };
    });

    // Insert new products
    await Product.insertMany(productsWithSlugAndSKU);

    console.log('Data imported successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();

    console.log('Data destroyed successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run seeder based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 