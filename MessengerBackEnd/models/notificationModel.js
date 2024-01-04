const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['MESSAGE','FRIEND_REQUEST','ACCEPT_FRIEND_REQUEST'], // Add more types as needed
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the UserModel for the sender
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the UserModel for the recipient
    required: true,
  },
  read: {
    type: Boolean,
    default: false, // Default value is false, indicating the notification is unread
  },
}, { timestamps: true });

const NotificationModel = mongoose.model('Notification', notificationSchema);

module.exports = NotificationModel;
