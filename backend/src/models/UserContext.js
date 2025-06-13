const mongoose = require('mongoose');

const UserContextSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    lastInteraction: {
      type: Date,
      default: Date.now
    },
    preferences: {
      language: {
        type: String,
        default: 'id'
      },
      responseStyle: {
        type: String,
        default: 'casual'
      },
      notifications: {
        type: Boolean,
        default: true
      },
    },
    profile: {
      name: String,
      interests: [String],
      commonTasks: [String],
      frequentTopics: [String]
    },
    conversationHistory: {
      recentTopics: [String],
      lastQuery: String,
      lastResponse: String
    },
    behaviorPatterns: {
      morningPerson: Boolean,
      typicalActiveHours: {
        start: String,
        end: String
      },
      commonActivities: [{
        activity: String,
        frequency: Number
      }]
    }
  },
  { timestamps: true }
);

// Indexes
UserContextSchema.index({ userId: 1 });

module.exports = mongoose.model('UserContext', UserContextSchema); 