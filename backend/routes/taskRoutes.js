const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // ✅ ADDED: Import Google AI library

const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getMyTasks,
  updateTaskStatus,
  addCommentToTask,
} = require('../controllers/taskController');

const { protect } = require('../middlewares/authMiddleware');


// Calendar route
router.get('/calendar', protect, async (req, res) => {
  try {
    const user = req.user;
    let query = {};

    if (user.role === 'admin') {
      query = {};
    } else {
      query = { assignedTo: user.id };
    }
    const tasks = await Task.find(query);

    const calendarEvents = tasks.map(task => {
      let eventColor = '#3788d8';
      if (task.status === 'In Progress') eventColor = '#f0ad4e';
      if (task.status === 'Done') eventColor = '#5cb85c';
      
      return { id: task._id, title: task.title, start: task.dueDate, color: eventColor, extendedProps: { status: task.status } };
    });

    res.json(calendarEvents);
  } catch (error) {
    console.error("Error fetching calendar tasks:", error);
    res.status(500).send("Server Error");
  }
});

// Admin Task CRUD Routes
router.route('/')
  .post(protect, createTask)
  .get(protect, getAllTasks);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

// Member Task Routes
router.get('/user/me', protect, getMyTasks);
router.put('/:taskId', protect, updateTaskStatus);
router.post('/:taskId/comment', protect, addCommentToTask);

// ✅ ADDED: New AI route for members to plan their day
// POST /api/tasks/user/me/plan
router.post('/user/me/plan', protect, async (req, res) => {
    try {
        // 1. Find all tasks for the logged-in user that are not yet "Done"
        const userTasks = await Task.find({ 
            assignedTo: req.user.id,
            status: { $ne: 'Done' } // $ne means "not equal to"
        });

        if (userTasks.length === 0) {
            return res.json({ plan: "You have no active tasks to plan. Great job!" });
        }

        // 2. Format the tasks into a prompt for Gemini
        const taskDetails = userTasks.map(t => `- "${t.title}" (Due: ${t.dueDate?.toISOString().split('T')[0] || 'N/A'}, Status: ${t.status})`).join('\n');
        const today = new Date().toISOString().split('T')[0];

        const prompt = `
            You are a friendly and efficient productivity assistant. Today's date is ${today}.
            A team member has the following active tasks:
            ${taskDetails}

            Analyze this list and create a simple, prioritized action plan for their day.
            Your plan should:
            1.  Start with a motivational sentence.
            2.  Identify the Top 1-3 Priority tasks for today, considering due dates and "In Progress" status.
            3.  List any other tasks they should keep in mind.
            
            Keep the response concise, clear, and use Markdown for formatting (bolding, lists).
        `;

        // 3. Call the Gemini API
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const plan = response.text();

        // 4. Send the plan back to the frontend
        res.json({ plan });

    } catch (error) {
        console.error("Error generating daily plan:", error);
        res.status(500).json({ message: "Failed to generate daily plan." });
    }
});


module.exports = router;