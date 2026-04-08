import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  status: { type: String, enum: ['Planning', 'InProgress', 'Completed', 'OnHold'], default: 'Planning' },
  deadline: { type: Date },
  tasks: [{
    title: { type: String },
    description: { type: String },
    status: { type: String, enum: ['Pending', 'InProgress', 'Completed'], default: 'Pending' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    estimatedTime: { type: String },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  }],
  aiAnalysis: {
    complexityScore: Number, // AI generated score
    riskAssessment: String,
    estimatedTimeline: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);