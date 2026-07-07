require('dotenv').config();
const mongoose = require('mongoose');

async function dropBadIndex() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('orders');

    // List all current indexes
    const indexes = await collection.indexes();
    console.log('\nCurrent indexes on orders collection:');
    indexes.forEach((idx) => console.log(' -', idx.name, JSON.stringify(idx.key)));

    // Drop the razorpayOrderId index if it exists
    const hasRazorpay = indexes.find((idx) => idx.name === 'razorpayOrderId_1');
    if (hasRazorpay) {
      await collection.dropIndex('razorpayOrderId_1');
      console.log('\n✅ Dropped index: razorpayOrderId_1');
    } else {
      console.log('\nℹ️  razorpayOrderId_1 index not found — nothing to drop');
    }

    console.log('\nDone! Restart your backend server now.\n');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

dropBadIndex();
