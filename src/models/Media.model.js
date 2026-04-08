import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  format: {
    type: String
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  size: {
    type: Number
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  usedIn: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ uploadedBy: 1 });

const Media = mongoose.model('Media', mediaSchema);

export default Media;
