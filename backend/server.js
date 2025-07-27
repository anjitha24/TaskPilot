const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // ✅ ADDED

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes); // ✅ ADDED

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(8000, () => {
      console.log('✅ Server running on port 8000 and MongoDB connected');
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));