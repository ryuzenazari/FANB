const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username harus diisi'],
      unique: true,
      trim: true,
      maxlength: [30, 'Username tidak bisa lebih dari 30 karakter']
    },
    email: {
      type: String,
      required: [true, 'Email harus diisi'],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Email tidak valid'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password harus diisi'],
      minlength: [6, 'Password minimal 6 karakter'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    profile: {
      firstName: {
        type: String,
        default: ''
      },
      lastName: {
        type: String,
        default: ''
      },
      avatar: {
        type: String,
        default: ''
      }
    },
    googleId: {
      type: String,
      default: null,
      sparse: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Enkripsi password menggunakan bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate dan return JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get full name
UserSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`.trim();
});

module.exports = mongoose.model('User', UserSchema); 