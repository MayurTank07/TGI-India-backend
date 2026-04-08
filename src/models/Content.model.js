import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'navbar',
      'footer',
      'home',
      'about',
      'testimonials',
      'contact',
      'services.it',
      'services.bpo',
      'services.nonit',
      'services.accounting',
      'services.healthcare',
      'services.corporate',
      'clients'
    ]
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Content = mongoose.model('Content', contentSchema);

export default Content;
