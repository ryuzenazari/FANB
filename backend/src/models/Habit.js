const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama kebiasaan harus diisi'],
      trim: true,
      maxlength: [100, 'Nama tidak bisa lebih dari 100 karakter']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Deskripsi tidak bisa lebih dari 500 karakter']
    },
    icon: {
      type: String,
      default: 'check-circle'
    },
    color: {
      type: String,
      default: '#10b981' // emerald-500
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'custom'],
      default: 'daily'
    },
    // Jika frequency adalah custom, maka customDays digunakan
    customDays: {
      type: [Number], // 0 = minggu, 1 = senin, dst.
      default: []
    },
    target: {
      type: Number,
      default: 1,
      min: [1, 'Target minimal 1']
    },
    unit: {
      type: String,
      default: 'kali'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    reminderTime: {
      type: Date
    },
    streak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indeks untuk pencarian
HabitSchema.index({ name: 'text', description: 'text' });
HabitSchema.index({ userId: 1 });
HabitSchema.index({ userId: 1, frequency: 1 });

// Virtual untuk menghitung persentase penyelesaian 
HabitSchema.virtual('completionLogs', {
  ref: 'HabitLog',
  localField: '_id',
  foreignField: 'habitId'
});

module.exports = mongoose.model('Habit', HabitSchema); 