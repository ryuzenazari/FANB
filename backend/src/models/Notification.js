const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Judul notifikasi harus diisi'],
      trim: true,
      maxlength: [100, 'Judul tidak bisa lebih dari 100 karakter']
    },
    message: {
      type: String,
      required: [true, 'Pesan notifikasi harus diisi'],
      trim: true,
      maxlength: [500, 'Pesan tidak bisa lebih dari 500 karakter']
    },
    type: {
      type: String,
      enum: ['task', 'habit', 'system', 'ai-insight', 'reminder'],
      default: 'system'
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'dismissed'],
      default: 'unread'
    },
    scheduledFor: {
      type: Date
    },
    icon: {
      type: String,
      default: 'bell'
    },
    color: {
      type: String,
      default: '#3b82f6' // blue-500
    },
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
      enum: ['Task', 'Habit', 'Note', 'User']
    },
    actionUrl: {
      type: String
    },
    repeat: {
      type: Boolean,
      default: false
    },
    repeatPattern: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'custom'],
      default: 'daily'
    },
    deliveryMethod: {
      type: String,
      enum: ['app', 'email', 'both'],
      default: 'app'
    }
  },
  {
    timestamps: true
  }
);

// Indeks untuk pencarian dan optimasi
NotificationSchema.index({ userId: 1, status: 1 });
NotificationSchema.index({ userId: 1, scheduledFor: 1 });
NotificationSchema.index({ relatedItemId: 1 });

module.exports = mongoose.model('Notification', NotificationSchema); 