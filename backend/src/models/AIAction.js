const mongoose = require('mongoose');

// Schema for AI Action logs
const AIActionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true
    },
    actionType: {
      type: String,
      enum: ['create_task', 'update_task', 'delete_task', 
             'create_schedule', 'update_schedule', 'delete_schedule',
             'create_habit', 'update_habit', 'delete_habit',
             'create_note', 'update_note', 'delete_note'],
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      // Could reference multiple models depending on actionType
    },
    targetModel: {
      type: String,
      enum: ['Task', 'Schedule', 'Habit', 'Note'],
      required: true
    },
    parameters: {
      type: Object,
      default: {}
    },
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'completed', 'failed'],
      default: 'requested'
    },
    result: {
      success: Boolean,
      message: String,
      data: Object
    },
    userPrompt: {
      type: String,
      required: true
    },
    aiResponse: {
      type: String
    }
  },
  { timestamps: true }
);

// Indexes
AIActionSchema.index({ userId: 1, status: 1 });
AIActionSchema.index({ conversationId: 1 });

module.exports = mongoose.model('AIAction', AIActionSchema); 