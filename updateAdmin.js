require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function updateAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Find the existing admin with old email
    const existingAdmin = await Admin.findOne({ email: 'valentinlyon205@gmail.com' });
    if (existingAdmin) {
      // Update the admin
      existingAdmin.email = 'kingbanks133@gmail.com';
      existingAdmin.password = 'mama_shema'; // This will be hashed by the pre-save hook
      await existingAdmin.save();
      console.log('Admin user updated successfully');
      console.log('New Email: kingbanks133@gmail.com');
      console.log('New Password: mama_shema');
    } else {
      console.log('Old admin user not found');
      // Check if new admin exists
      const newAdmin = await Admin.findOne({ email: 'kingbanks133@gmail.com' });
      if (newAdmin) {
        console.log('New admin user already exists');
      } else {
        // Create new admin
        const admin = new Admin({
          email: 'kingbanks133@gmail.com',
          password: 'mama_shema',
        });
        await admin.save();
        console.log('Admin user created successfully');
        console.log('Email: kingbanks133@gmail.com');
        console.log('Password: mama_shema');
      }
    }

  } catch (error) {
    console.error('Error updating admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

updateAdmin();
