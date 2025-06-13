const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama kategori harus diisi'],
      trim: true,
      maxlength: [50, 'Nama kategori tidak bisa lebih dari 50 karakter']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Deskripsi tidak bisa lebih dari 200 karakter']
    },
    color: {
      type: String,
      default: '#3b82f6' // Default blue color
    },
    icon: {
      type: String,
      default: 'folder'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indeks untuk pencarian
CategorySchema.index({ name: 'text' });
CategorySchema.index({ userId: 1 });

module.exports = mongoose.model('Category', CategorySchema); 