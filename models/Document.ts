import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // Markdown or text content
  type: { type: String, default: 'General' }, // Guide, API, Meeting, Design, DevOps, etc.
  category: { type: String, default: 'Uncategorized' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);