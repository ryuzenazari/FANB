const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const ConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      default: 'New Conversation'
    },
    messages: [MessageSchema],
    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Indexes
ConversationSchema.index({ userId: 1, lastMessageAt: -1 });

module.exports = mongoose.model('Conversation', ConversationSchema); 