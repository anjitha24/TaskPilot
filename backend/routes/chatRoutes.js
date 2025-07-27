const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// POST /api/chat
router.post('/', protect, async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Retrieve context data
    const projects = await Project.find({});
    const tasks = await Task.find({}).populate('assignedTo', 'name');

    // 2. Format the context
    let context = "Here is the current state of all projects and tasks:\n\n";
    projects.forEach(p => {
        context += `Project: "${p.title}" (Description: ${p.description})\n`;
        const projectTasks = tasks.filter(t => t.project.toString() === p._id.toString());
        if (projectTasks.length > 0) {
            projectTasks.forEach(t => {
                context += `  - Task: "${t.title}", Status: ${t.status}, Assigned to: ${t.assignedTo?.name || 'Unassigned'}\n`;
            });
        } else {
            context += "  - No tasks for this project.\n";
        }
        context += "\n";
    });

    // 3. ✅ UPDATED: A much stricter prompt for the AI
    const prompt = `
        **SYSTEM INSTRUCTION:**
        You are TaskPilot AI, a project management assistant.
        Your primary directive is to answer the user's question based *exclusively* on the CONTEXT DATA provided below.
        - **DO NOT** make up any information, projects, or tasks that are not explicitly listed in the context.
        - **DO NOT** refer to external knowledge.
        - If the user's question cannot be answered using the provided context, you **MUST** respond with: "I'm sorry, I can only answer questions about the project data I have access to."
        - Analyze the data carefully to provide accurate answers about status, assignments, and project details.

        ---
        **CONTEXT DATA:**
        ${context}
        ---

        **USER'S QUESTION:**
        "${message}"

        **YOUR ANSWER:**
    `;

    // 4. Call the Gemini API with Retry Logic
    let aiResponse;
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            aiResponse = response.text();
            break; // If the call is successful, exit the loop
        } catch (error) {
            // Check if it's a 503 error and not the last attempt
            if (error.status === 503 && i < maxRetries - 1) {
                console.log(`Model overloaded, retrying in 2 seconds... (Attempt ${i + 1})`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
            } else {
                throw error; // If it's another error or the last retry, fail permanently
            }
        }
    }

    // 5. Send the AI's answer back to the frontend
    res.json({ reply: aiResponse });

  } catch (error) {
    console.error("Error in chatbot:", error);
    res.status(500).json({ message: "The AI assistant is currently unavailable." });
  }
});

module.exports = router;