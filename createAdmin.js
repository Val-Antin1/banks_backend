require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'valentinlyon205@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new Admin({
      email: 'valentinlyon205@gmail.com',
      password: 'mamannkunda', // This will be hashed by the pre-save hook
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: valentinlyon205@gmail.com');
    console.log('Password: mamannkunda');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

createAdmin();
