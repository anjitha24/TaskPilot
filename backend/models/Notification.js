const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // The user who should receive the notification
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // The user who triggered the notification (e.g., the admin who assigned a task)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // The type of notification
  type: {
    type: String,
    enum: ['NEW_TASK', 'STATUS_UPDATE', 'NEW_COMMENT', 'BADGE_AWARDED'],
    required: true,
  },
  // The message that will be displayed
  message: {
    type: String,
    required: true,
  },
  // A link to the relevant item (e.g., the task or project page)
  link: {
    type: String,
  },
  // Whether the user has seen the notification yet
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Notification', notificationSchema);