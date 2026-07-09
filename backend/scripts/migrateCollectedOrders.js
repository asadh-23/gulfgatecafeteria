/**
 * Migration Script: Update all 'collected' status orders to 'completed'
 * Run this once to migrate existing data
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../src/models/Order');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gulfgatecafeteria';

async function migrateOrders() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    console.log('\nSearching for orders with "collected" status...');
    const collectedOrders = await Order.find({ status: 'collected' });
    
    if (collectedOrders.length === 0) {
      console.log('No orders found with "collected" status. Migration not needed.');
      process.exit(0);
    }

    console.log(`Found ${collectedOrders.length} order(s) with "collected" status`);
    
    console.log('\nUpdating orders to "completed" status...');
    const result = await Order.updateMany(
      { status: 'collected' },
      { $set: { status: 'completed' } }
    );

    console.log(`✓ Successfully updated ${result.modifiedCount} order(s)`);
    
    console.log('\nMigration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
}

migrateOrders();
