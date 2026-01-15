require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function deleteOldAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Delete the old admin
    const result = await Admin.deleteOne({ email: 'valentinlyon205@gmail.com' });
    if (result.deletedCount > 0) {
      console.log('Old admin deleted successfully');
    } else {
      console.log('Old admin not found');
    }

    // Also delete the default admin@example.com if it exists
    const result2 = await Admin.deleteOne({ email: 'admin@example.com' });
    if (result2.deletedCount > 0) {
      console.log('Default admin deleted successfully');
    } else {
      console.log('Default admin not found');
    }

    // Ensure the new admin exists
    const newAdmin = await Admin.findOne({ email: 'kingbanks133@gmail.com' });
    if (newAdmin) {
      console.log('New admin exists');
    } else {
      console.log('New admin not found, creating...');
      const admin = new Admin({
        email: 'kingbanks133@gmail.com',
        password: 'mama_shema',
      });
      await admin.save();
      console.log('New admin created');
    }

  } catch (error) {
    console.error('Error deleting admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

deleteOldAdmin();
