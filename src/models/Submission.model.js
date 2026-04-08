import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    enum: ['Home Page Contact Form', 'Contact Us Page']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
submissionSchema.index({ createdAt: -1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ source: 1 });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
