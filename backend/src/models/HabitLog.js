const mongoose = require('mongoose');

const HabitLogSchema = new mongoose.Schema(
  {
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    value: {
      type: Number,
      default: 1,
      min: [0, 'Nilai tidak boleh negatif']
    },
    notes: {
      type: String,
      maxlength: [200, 'Catatan tidak bisa lebih dari 200 karakter']
    },
    skipped: {
      type: Boolean,
      default: false
    },
    mood: {
      type: String,
      enum: ['bad', 'neutral', 'good', 'great'],
      default: 'neutral'
    }
  },
  {
    timestamps: true
  }
);

// Indeks untuk mempercepat pencarian log
HabitLogSchema.index({ habitId: 1, date: 1 });
HabitLogSchema.index({ userId: 1, date: 1 });

// Mencegah duplikasi log untuk hari yang sama
HabitLogSchema.index(
  { habitId: 1, date: 1, userId: 1 },
  { unique: true }
);

module.exports = mongoose.model('HabitLog', HabitLogSchema); 