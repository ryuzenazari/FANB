const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Judul tugas harus diisi'],
      trim: true,
      maxlength: [100, 'Judul tidak bisa lebih dari 100 karakter']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Deskripsi tidak bisa lebih dari 500 karakter']
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed'],
      default: 'todo'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    dueDate: {
      type: Date
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    labels: [String],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    completedAt: {
      type: Date
    },
    reminderDate: {
      type: Date
    },
    attachments: [
      {
        name: String,
        path: String,
        type: String
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indeks untuk pencarian dan pengurutan
TaskSchema.index({ title: 'text', description: 'text' });
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ dueDate: 1 });

// Middleware untuk mengatur completedAt saat status berubah menjadi 'completed'
TaskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

// Virtual untuk menghitung apakah tugas terlambat
TaskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate) return false;
  if (this.status === 'completed') return false;
  return new Date() > this.dueDate;
});

module.exports = mongoose.model('Task', TaskSchema); 