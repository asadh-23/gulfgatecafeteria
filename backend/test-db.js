require('dotenv').config();
const mongoose = require('mongoose');

/**
 * Quick MongoDB connection test script
 * Run with: node test-db.js
 */
async function testConnection() {
  console.log('🔍 Testing MongoDB connection...\n');
  
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ SUCCESS! MongoDB connection established');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`🔢 Port: ${conn.connection.port || 'default'}`);
    console.log(`✨ Ready State: ${conn.connection.readyState} (1 = connected)`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\n🔒 Connection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ FAILED! MongoDB connection error:');
    console.error(`Error Message: ${error.message}`);
    console.error('\nTroubleshooting tips:');
    console.error('1. Check if MONGO_URI is correctly set in .env');
    console.error('2. Verify your IP is whitelisted in MongoDB Atlas');
    console.error('3. Ensure database credentials are correct');
    console.error('4. Check if the MongoDB cluster is running');
    process.exit(1);
  }
}

testConnection();
