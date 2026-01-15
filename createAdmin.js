require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'kingbanks133@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new Admin({
      email: 'kingbanks133@gmail.com',
      password: 'mama_shema', // This will be hashed by the pre-save hook
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: kingbanks133@gmail.com');
    console.log('Password: mama_shema');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

createAdmin();
