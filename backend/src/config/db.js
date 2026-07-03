const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB (no options needed for Mongoose 6+)
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔒 MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.error('Error Details:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
