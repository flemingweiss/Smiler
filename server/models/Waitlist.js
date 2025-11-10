import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  signupDate: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create compound index for efficient queries
waitlistSchema.index({ email: 1, signupDate: -1 });

const Waitlist = mongoose.model('Waitlist', waitlistSchema);

export default Waitlist;
