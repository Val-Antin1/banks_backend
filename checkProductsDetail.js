require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function checkProductsDetail() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Get all products with all fields
    const products = await Product.find().sort({ createdAt: -1 });
    console.log(`Found ${products.length} products:`);

    products.forEach((product, index) => {
      console.log(`\n--- Product ${index + 1} ---`);
      console.log('Raw document:', JSON.stringify(product, null, 2));
    });

  } catch (error) {
    console.error('Error checking products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

checkProductsDetail();
