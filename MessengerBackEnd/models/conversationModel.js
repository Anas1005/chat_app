const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      to: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      from: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      type: {
        type: String,
        enum: ["divider", "msg"],
      },
      subtype: {
        type: String,
        enum: ["img-video", "doc", "link", "reply"],
      },
      text: {
        type: String,
      },
      fileURL: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      status: {
        type: String,
        enum: ["Sent", "Delivered","Seen"]
      },
    },
  ],
});

const Conversation = new mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
