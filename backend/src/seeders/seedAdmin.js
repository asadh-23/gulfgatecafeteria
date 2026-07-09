require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

/**
 * Admin Seeder Script
 * Creates a default admin user for Gulf Gate Cafeteria
 */

const adminData = {
  name: 'Gulf Gate Admin',
  email: 'gulfgate.1133@gmail.com',
  phone: '+971501234567',
  password: 'gulfgate1133',
  role: 'admin',
  isActive: true,
};

const seedAdmin = async () => {
  try {
    console.log('\n🌱 Starting Admin Seeder...\n');

    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:');
      console.log(`   📧 Email: ${existingAdmin.email}`);
      console.log(`   👤 Name: ${existingAdmin.name}`);
      console.log(`   🔑 Role: ${existingAdmin.role}`);
      console.log('\n✅ No changes made.\n');
    } else {
      // Create new admin user (password will be hashed automatically by the User model pre-save hook)
      const admin = await User.create(adminData);

      console.log('✅ Admin user created successfully!\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 Admin Credentials:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📧 Email:    ${admin.email}`);
      console.log(`🔒 Password: ${adminData.password}`);
      console.log(`👤 Name:     ${admin.name}`);
      console.log(`🔑 Role:     ${admin.role}`);
      console.log(`📱 Phone:    ${admin.phone}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('⚠️  IMPORTANT: Please save these credentials securely!\n');
    }

    // Disconnect from database
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding admin user:', error.message);
    process.exit(1);
  }
};

// Run seeder
seedAdmin();
