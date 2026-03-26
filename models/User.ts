import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String }, // User avatar
  role: { type: String, default: 'Member' }, // e.g., Admin, Member
  bio: { type: String },
  skills: [{ type: String }], // Skills extracted from resume/GitHub
  githubProfile: {
    username: String,
    repoCount: Number,
    contributions: Number,
    topLanguages: [String],
  },
  resumeUrl: { type: String }, // Link to stored resume
  experience: { type: Number, default: 0 }, // Years of experience
  points: { type: Number, default: 0 }, // Gamification points
  level: { type: Number, default: 1 },
  badges: [{
    name: String,
    description: String,
    icon: String, // lucide icon name or image url
    unlocked: { type: Boolean, default: false },
    dateEarned: { type: Date }
  }],
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  createdAt: { type: Date, default: Date.now },
  uniqueId: { type: String, unique: true, sparse: true }, // Short unique ID for sharing
});

export default mongoose.models.User || mongoose.model('User', UserSchema);