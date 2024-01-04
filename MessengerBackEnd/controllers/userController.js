const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestModel");
const Notification = require("../models/notificationModel");

exports.getUsers = async (req, res, next) => {
  try {
    const this_user = req.user;

    // Get the IDs of users who have sent friend requests to the current user
    const usersWhoSentRequests = await FriendRequest.find({
      recipient: this_user._id,
    }).distinct("sender");

    // Find users to whom this_user sent friend requests
    const usersToWhomRequestsWereSent = await FriendRequest.find({
      sender: this_user._id,
    }).distinct("recipient");

    // Combine the arrays to get all unique users involved in friend requests
    const allUsersWithFriendRequests = [
      ...usersWhoSentRequests,
      ...usersToWhomRequestsWereSent,
    ];

    // Remove duplicates by converting the array to a Set and then back to an array
    const uniqueUsersWithFriendRequests = [
      ...new Set(allUsersWithFriendRequests),
    ];

    // Use MongoDB query to find users that meet the specified conditions
    const remaining_users = await User.find({
      verified: true,
      _id: {
        $nin: [
          ...this_user.friends,
          this_user._id,
          ...uniqueUsersWithFriendRequests,
        ],
      },
    }).select("firstName lastName _id");

    console.log("Remaining Users:", remaining_users);

    res.status(200).json({
      status: "success",
      data: remaining_users,
      message: "Users found successfully!",
    });
  } catch (error) {
    console.error("Error in getUsers:", error.message);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// Log function to print messages with timestamps
const log = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

exports.getFriendRequests = async (req, res, next) => {
  try {
    // Find friend requests for the current user
    const friendRequests = await FriendRequest.find({ recipient: req.user._id })
      .populate("sender", "_id firstName lastName")
      .select("_id firstName lastName");

    log("Friend Requests found successfully!");

    res.status(200).json({
      status: "success",
      data: friendRequests,
      message: "Friend Requests found successfully!",
    });
  } catch (error) {
    console.error(`Error in getRequests: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.getFriends = async (req, res, next) => {
  try {
    // Find the current user and populate the friends field
    const this_user = await User.findById(req.user._id).populate(
      "friends",
      "_id firstName lastName"
    );

    log("Friends found successfully!");

    res.status(200).json({
      status: "success",
      data: this_user.friends,
      message: "Friends found successfully!",
    });
  } catch (error) {
    console.error(`Error in getFriends: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.markNotificationAsRead = async (req, res, next) => {
  try {
    const notificationId = req.body.notificationId;

    // Find the notification in the database by its ID
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      console.error("Notification not found");
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }

    // Update the 'read' property to mark it as read
    notification.read = true;

    // Save the updated notification
    await notification.save();

    console.log("Notification marked as read successfully");
    res.status(200).json({
      status: "success",
      message: "Notification marked as read successfully",
      data: notification,
    });
  } catch (error) {
    console.error(`Error in markNotificationAsRead: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.removeNotification = async (req, res, next) => {
  try {
    const notificationId = req.body.notificationId;

    // Find the notification in the database by its ID and remove it
    await Notification.findByIdAndDelete(notificationId);

    console.log("Notification removed successfully");
    res.status(200).json({
      status: "success",
      message: "Notification removed successfully",
    });
  } catch (error) {
    console.error(`Error in removeNotification: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
