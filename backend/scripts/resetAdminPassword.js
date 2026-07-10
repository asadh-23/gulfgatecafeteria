require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const admin = await User.findOne({ email: 'gulfgate.1133@gmail.com' }).select('+password');
    if (!admin) {
      console.log('❌ Admin not found');
      return;
    }

    // Force update role and password (triggers bcrypt pre-save hook)
    admin.role = 'admin';
    admin.password = 'Gulfgate1133';
    admin.isActive = true;
    await admin.save();

    console.log('✅ Admin password reset and role confirmed!');
    console.log('\n📋 Login Credentials:');
    console.log('   Email:    gulfgate.1133@gmail.com');
    console.log('   Password: Gulfgate1133');
    console.log('   URL:      http://localhost:3001/login\n');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

resetAdmin();
