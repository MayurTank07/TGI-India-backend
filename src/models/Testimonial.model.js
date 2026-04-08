import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['employers', 'jobSeekers', 'growingTeams']
  },
  text: {
    type: String,
    required: [true, 'Testimonial text is required'],
    trim: true
  },
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
testimonialSchema.index({ category: 1, order: 1 });
testimonialSchema.index({ isActive: 1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
