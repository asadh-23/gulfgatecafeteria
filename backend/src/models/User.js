const mongoose = require('mongoose');

/**
 * User Schema
 * Example model for reference - customize based on your requirements
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [50, 'Username cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ['customer', 'staff', 'admin'],
      default: 'customer'
    },
    refreshToken: {
      type: String,
      select: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        return ret;
      }
    }
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Instance methods
userSchema.methods.toSafeObject = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
