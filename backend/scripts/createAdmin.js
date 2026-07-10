require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const ADMIN = {
  name: 'Gulf Gate Admin',
  email: 'gulfgate.1133@gmail.com',
  phone: '0501133000',
  password: 'Gulfgate1133',
  role: 'admin',
};

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log(`✅ Promoted existing user to admin: ${ADMIN.email}`);
      } else {
        console.log(`ℹ️  Admin already exists: ${ADMIN.email}`);
      }
    } else {
      await User.create(ADMIN);
      console.log(`✅ Admin created successfully!`);
    }

    console.log('\n📋 Admin Credentials:');
    console.log(`   Email:    ${ADMIN.email}`);
    console.log(`   Password: ${ADMIN.password}`);
    console.log('\n🔐 Login at: http://localhost:3001/login\n');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();
