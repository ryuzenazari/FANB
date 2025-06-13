const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Judul catatan harus diisi'],
      trim: true,
      maxlength: [100, 'Judul tidak bisa lebih dari 100 karakter']
    },
    content: {
      type: String,
      required: [true, 'Isi catatan harus diisi'],
      trim: true
    },
    type: {
      type: String,
      enum: ['note', 'journal', 'idea', 'goal'],
      default: 'note'
    },
    color: {
      type: String,
      default: '#f8fafc' // slate-50
    },
    tags: [String],
    pinned: {
      type: Boolean,
      default: false
    },
    archived: {
      type: Boolean,
      default: false
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    attachments: [
      {
        name: String,
        path: String,
        type: String
      }
    ],
    linkedTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      }
    ],
    mood: {
      type: String,
      enum: ['very-bad', 'bad', 'neutral', 'good', 'very-good'],
      default: 'neutral'
    }
  },
  {
    timestamps: true
  }
);

// Indeks untuk pencarian
NoteSchema.index({ title: 'text', content: 'text' });
NoteSchema.index({ userId: 1 });
NoteSchema.index({ userId: 1, type: 1 });
NoteSchema.index({ userId: 1, tags: 1 });

module.exports = mongoose.model('Note', NoteSchema); 