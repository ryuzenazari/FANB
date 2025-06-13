const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Judul jadwal harus diisi'],
      trim: true,
      maxlength: [100, 'Judul tidak bisa lebih dari 100 karakter']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Deskripsi tidak bisa lebih dari 500 karakter']
    },
    startTime: {
      type: Date,
      required: [true, 'Waktu mulai harus diisi']
    },
    endTime: {
      type: Date,
      required: [true, 'Waktu selesai harus diisi']
    },
    isAllDay: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['event', 'meeting', 'task', 'focus-time', 'break', 'routine'],
      default: 'event'
    },
    location: {
      type: String,
      trim: true
    },
    color: {
      type: String,
      default: '#60a5fa' // blue-400
    },
    recurrence: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly', 'custom'],
      default: 'none'
    },
    recurrenceRule: {
      // Format RFC 5545 (iCalendar)
      type: String
    },
    recurrenceEnd: {
      type: Date
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'canceled'],
      default: 'scheduled'
    },
    reminders: [
      {
        time: Date,
        type: {
          type: String,
          enum: ['notification', 'email', 'both'],
          default: 'notification'
        }
      }
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    relatedItemId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedItemModel'
    },
    relatedItemModel: {
      type: String,
      enum: ['Task', 'Habit']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    participants: [
      {
        email: String,
        name: String,
        status: {
          type: String,
          enum: ['pending', 'accepted', 'declined'],
          default: 'pending'
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Indeks untuk pencarian dan optimasi
ScheduleSchema.index({ userId: 1, startTime: 1 });
ScheduleSchema.index({ userId: 1, endTime: 1 });
ScheduleSchema.index({ userId: 1, type: 1 });
ScheduleSchema.index({ relatedItemId: 1 });

module.exports = mongoose.model('Schedule', ScheduleSchema); 