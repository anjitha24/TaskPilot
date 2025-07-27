const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, default: 'Low' },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  dueDate: Date,
  progress: { type: Number, default: 0 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // ✅ reference to User
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },   // ✅ reference to Project
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  attachments: [String],
  todoChecklist: [String],
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
