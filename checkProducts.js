require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function checkProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Get all products
    const products = await Product.find().sort({ createdAt: -1 });
    console.log(`Found ${products.length} products:`);

    products.forEach((product, index) => {
      console.log(`${index + 1}. ID: ${product._id}, Name: ${product.name}, Image: ${product.image}`);
    });

  } catch (error) {
    console.error('Error checking products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

checkProducts();
