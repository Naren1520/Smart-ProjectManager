import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }, // Purpose of the team
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['Leader', 'Member'], default: 'Member' },
  }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  createdAt: { type: Date, default: Date.now },
  uniqueId: { type: String, unique: true, sparse: true }, // Unique identifier for joining
});

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);