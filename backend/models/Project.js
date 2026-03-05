const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  aiScore: Number // AI Prioritization Score
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['Planning', 'Active', 'Completed', 'On Hold'], default: 'Planning' },
  deadline: Date,
  tasks: [taskSchema],
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' } // AI Deadline Risk
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);