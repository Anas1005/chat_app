const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestModel");


exports.getUsers = async (req, res, next) => {
    try {
      const this_user = req.user;
  
      // Use MongoDB query to find users that meet the specified conditions
      const remaining_users = await User.find({
        verified: true,
        _id: { $nin: [...this_user.friends, this_user._id] }
      }).select("firstName lastName _id");
  
      console.log("Remaining Users:", remaining_users);
  
      res.status(200).json({
        status: "success",
        data:remaining_users,
        message: "Users found successfully!",
      });
    } catch (error) {
      console.error('Error in getUsers:', error.message);
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
        data:friendRequests,
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
  
  
