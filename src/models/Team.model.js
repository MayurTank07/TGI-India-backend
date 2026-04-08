import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  imagePublicId: {
    type: String
  },
  linkedin: {
    type: String,
    default: '#'
  },
  twitter: {
    type: String,
    default: '#'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
teamSchema.index({ order: 1 });
teamSchema.index({ isActive: 1 });

const Team = mongoose.model('Team', teamSchema);

export default Team;
