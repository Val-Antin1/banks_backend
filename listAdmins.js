require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function listAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const admins = await Admin.find({}, 'email');
    console.log('Admins:');
    admins.forEach(admin => console.log(admin.email));

  } catch (error) {
    console.error('Error listing admins:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

listAdmins();
