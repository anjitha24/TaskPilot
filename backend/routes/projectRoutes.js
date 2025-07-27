const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

// --- Cleaned up Project CRUD Routes ---
router.route('/')
  .post(protect, createProject)
  .get(protect, getAllProjects);

router.route('/:id')
  .put(protect, updateProject)
  .delete(protect, deleteProject);

// --- New route for Gemini AI Insights ---
// POST /api/projects/:id/insights
router.post('/:id/insights', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Action not authorized. Admins only.' });
  }

  try {
    // 1. Initialize Gemini AI with your API key from the .env file
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // ✅ FIXED: Updated the model name to the latest version
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // 2. Find the project and its associated tasks from your database
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const tasks = await Task.find({ project: req.params.id });

    // 3. Create a detailed prompt for the AI
    let taskDetails = tasks.map(t => `- Task: "${t.title}", Status: ${t.status}, Due: ${t.dueDate?.toISOString().split('T')[0]}`).join('\n');
    if (tasks.length === 0) {
        taskDetails = "No tasks have been created for this project yet.";
    }

    const prompt = `
      Analyze the following project data for a task management system. Provide a concise, professional summary for a project manager.

      Project Title: ${project.title}
      Project Description: ${project.description}
      Start Date: ${project.startDate?.toISOString().split('T')[0]}
      End Date: ${project.endDate?.toISOString().split('T')[0]}

      Tasks:
      ${taskDetails}

      Based on this data, provide the following insights in three distinct sections:
      1.  **Project Status Overview:** A brief summary of the project's current state.
      2.  **Potential Risks & Bottlenecks:** Identify any potential issues, like overdue tasks, too many tasks due at once, or tasks that seem blocked.
      3.  **Suggested Next Steps:** Recommend 3 concrete, actionable steps the project manager should take next.

      Format your response clearly using Markdown.
    `;

    // 4. Call the Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text();

    // 5. Send the AI's response back to the frontend
    res.json({ insights });

  } catch (error) {
    console.error('Error getting Gemini insights:', error);
    res.status(500).json({ message: 'Failed to generate AI insights.' });
  }
});

module.exports = router;