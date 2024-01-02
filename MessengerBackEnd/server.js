const app = require("./app");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const dbConnect = require("./config/database");
dotenv.config();

const User = require("./models/userModel");
const FriendRequest = require("./models/friendRequestModel");
const Conversation = require("./models/conversationModel");

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("UNCAUGHT Exception! Shutting down ...");
  process.exit(1); // Exit Code 1 indicates that a container shut down, either because of an application failure.
});

const http = require("http");

const server = http.createServer(app);

const isProduction = process.env.NODE_ENV === 'production';

// Set the allowed origin based on the environment
const allowedOrigin = isProduction ? 'https://chat-app-frontend-seven-jet.vercel.app' : 'http://localhost:3000';

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

dbConnect();

// Add this
// Listen for when the client connects via socket.io-client
io.on("connection", async (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Log the handshake query information
  console.log("Handshake Query:", socket.handshake.query);

  const user_id = socket.handshake.query["user_id"];

  if (user_id != null && Boolean(user_id)) {
    try {
      // Update user information with socket id and status
      await User.findByIdAndUpdate(user_id, {
        socket_id: socket.id,
        status: "Online",
      });

      // Mark undelivered messages as "Delivered" for the logged-in user
      const updateResult = await Conversation.updateMany(
        {
          participants: { $in: [user_id] },
          "messages.to": user_id,
          "messages.status": "Sent",
        },
        { $set: { "messages.$[elem].status": "Delivered" } },
        { arrayFilters: [{ "elem.status": "Sent", "elem.to": user_id }], multi: true }
      );
      console.log("Update Result", updateResult);

      const onlineUsers = (
        await User.find({ status: "Online" }).select("_id").lean()
      ).map((user) => user._id);

      console.log(`User ${user_id} updated with socket id: ${socket.id}`);
      socket.emit("get_online_users", { onlineUsers });
      socket.broadcast.emit("user_online", { user_id });
    } catch (e) {
      console.error("Error updating user:", e.message);
    }
  }

  socket.on("friend_request", async (data) => {
    try {
      const to = await User.findById(data.to).select("socket_id");
      const from = await User.findById(data.from).select("socket_id");

      // Create a friend request
      await FriendRequest.create({
        sender: data.from,
        recipient: data.to,
      });

      // Emit event request received to recipient
      io.to(to?.socket_id).emit("new_friend_request", {
        message: "New friend request received",
      });

      // Emit event request sent to sender
      io.to(from?.socket_id).emit("request_sent", {
        message: "Request Sent successfully!",
      });

      console.log(`Friend request sent from ${data.from} to ${data.to}`);
    } catch (error) {
      console.error("Error handling friend request:", error.message);
    }
  });

  socket.on("accept_request", async (data) => {
    console.log("Accepting friend request:", data);

    try {
      // Find friend request document by ID
      const requestDoc = await FriendRequest.findById(data.request_id);
      console.log("Friend Request Document:", requestDoc);

      // Find sender and receiver user documents
      const sender = await User.findById(requestDoc.sender);
      const receiver = await User.findById(requestDoc.recipient);

      // Add each other to friends array and update in one line
      await Promise.all([
        User.findByIdAndUpdate(sender._id, {
          $push: { friends: requestDoc.recipient },
        }),
        User.findByIdAndUpdate(receiver._id, {
          $push: { friends: requestDoc.sender },
        }),
      ]);

      // Delete the friend request document
      await FriendRequest.findByIdAndDelete(data.request_id);
      console.log("Friend Request Document Deleted");

      // Emit event request accepted to both sender and receiver
      io.to(sender?.socket_id).emit("request_accepted", {
        message: "Friend Request Accepted",
      });
      io.to(receiver?.socket_id).emit("request_accepted", {
        message: "Friend Request Accepted",
      });

      console.log("Friend request accepted and events emitted");
    } catch (error) {
      console.error("Error accepting friend request:", error.message);
    }
  });

  socket.on("start_conversation", async (data) => {
    try {
      // Destructure data
      const { to, from } = data;
      console.log("Starting Conv");

      // Check if there is any existing conversation
      const existing_conversations = await Conversation.find({
        participants: { $size: 2, $all: [to, from] },
      }).populate("participants", "firstName lastName _id email status");

      console.log(existing_conversations[0], "Existing Conversation");

      // If no existing conversation, create a new Conversation doc
      if (existing_conversations.length === 0) {
        let new_chatT = await Conversation.create({
          participants: [to, from],
        });
        console.log("New Chat", new_chatT);

        // Populate participants data and emit "start_chat" event with conversation details
        const new_chat = await Conversation.findById(new_chatT._id).populate(
          "participants",
          "firstName lastName _id email status"
        );

        console.log(new_chat);

        socket.emit("start_chat", new_chat);
      }
      // If there is an existing conversation, emit "start_chat" event with conversation details
      else {
        socket.emit("start_chat", existing_conversations[0]);
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      // Handle errors as needed
    }
  });

  socket.on("get_messages", async (data, callback) => {
    console.log("Get Messages ");
    try {
      // Find messages for the specified conversation_id
      const { messages } = await Conversation.findById(
        data.conversation_id
      ).select("messages");

      // console.log("Messages", messages);

      // Invoke the callback with the messages
      callback(messages);
    } catch (error) {
      console.error("Error getting messages:", error);
      // Handle errors as needed
    }
  });

  socket.on("get_direct_conversations", async ({ user_id }, callback) => {
    console.log("Get DC ");
    const existing_conversations = await Conversation.find({
      participants: { $all: [user_id] },
    }).populate("participants", "firstName lastName avatar _id email status");

    // db.books.find({ authors: { $elemMatch: { name: "John Smith" } } })
    const from_user = await User.findById(user_id);
    console.log("Request Socket ID", socket.id);
    console.log("SID in DB : ", from_user.socket_id);

    // console.log("DirectConversations", existing_conversations);

    callback(existing_conversations);
  });

  // socket.on("send_message", async (data) => {
  //   console.log("Send Message");
  //   try {
  //     console.log("Received message:", data);

  //     // Destructure data
  //     const { conversation_id, from, to, type, text, subtype } = data;

  //     // Find user documents
  //     const to_user = await User.findById(to);
  //     const from_user = await User.findById(from);

  //     console.log("Request Socket ID", socket.id);
  //     console.log("SID in DB : ", from_user.socket_id);

  //     // Create a new message object
  //     const new_message = {
  //       from,
  //       to,
  //       type,
  //       text,
  //       subtype,
  //       createdAt: Date.now(),
  //     };
  //     console.log("New Message", new_message);

  //     // Find and update Conversation document
  //     const chat = await Conversation.findByIdAndUpdate(
  //       conversation_id,
  //       { $push: { messages: new_message } },
  //       { new: true, validateModifiedOnly: true }
  //     );

  //     // Emit new message to the recipient
  //     io.to(to_user?.socket_id).emit("new_message", {
  //       conversation_id,
  //       message: new_message,
  //     });

  //     // Emit new message to the sender
  //     io.to(from_user?.socket_id).emit("new_message", {
  //       conversation_id,
  //       message: new_message,
  //     });
  //   } catch (error) {
  //     console.error("Error processing text message:", error);
  //     // Handle errors as needed
  //   }
  // });

  socket.on("send_message", async (data) => {
    console.log("Send Message");
    try {
      console.log("Received message:", data);

      // Destructure data
      const { conversation_id, from, to, type, text, subtype } = data;

      // Find user documents
      const to_user = await User.findById(to);
      const from_user = await User.findById(from);

      console.log("Request Socket ID", socket.id);
      console.log("SID in DB : ", from_user.socket_id);

      // Create a new message object
      const new_message = {
        from,
        to,
        type,
        text,
        subtype,
        createdAt: Date.now(),
        status: "", // Add a status property to the message
      };
      

      const isRecipientOnline = to_user.status === "Online";
      const isRecipientInRoom =
        io.sockets.adapter.rooms
          .get(getChatRoomName(from, to))
          ?.has(to_user?.socket_id) || false;
      console.log(
        "Room",
        io.sockets.adapter.rooms.get(getChatRoomName(from, to))
      );
      console.log(isRecipientInRoom);

      if (isRecipientOnline && isRecipientInRoom) {
        new_message.status = "Seen";
      } else if (isRecipientOnline) {
        new_message.status = "Delivered";
      } else {
        new_message.status = "Sent";
      }
      console.log("New Message", new_message);

      // Find and update Conversation document
      await Conversation.findByIdAndUpdate(
        conversation_id,
        { $push: { messages: new_message } },
        { new: true, validateModifiedOnly: true }
      );

      // Update the status of the message based on recipient's status and presence in the room

      // Emit new message to the recipient
      io.to(to_user?.socket_id).emit("new_message", {
        conversation_id,
        message: new_message,
      });

      // Emit new message to the sender
      io.to(from_user?.socket_id).emit("new_message", {
        conversation_id,
        message: new_message,
      });
    } catch (error) {
      console.error("Error processing text message:", error);
      // Handle errors as needed
    }
  });

  socket.on("join_chat_room", async (data) => {
    // Leave all existing rooms
    const socketRoomsArray = Array.from(socket.rooms);
    console.log("PrevRooms", socketRoomsArray);
    console.log("Lol");
    socketRoomsArray.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
        console.log(`User left room: ${room}`);
      }
      
    });

    // Join the new room

    const chatRoom = getChatRoomName(data.from, data.to);
    console.log("RoomID:",getChatRoomName(data.from, data.to));
    socket.join(chatRoom);
    console.log("NewSocketRooms", socket.rooms);
    console.log("NewSocketRoomsArray", Array.from(socket.rooms));


    console.log(`User ${data.from} joined the chat room ${chatRoom}`);

    // Update the status of messages from User B to "Seen"
    const updateResult = await Conversation.updateOne(
      {
        participants: { $all: [data.from, data.to] },
      },
      { $set: { "messages.$[elem].status": "Seen" } },
      { arrayFilters: [{ "elem.from": data.to }] }
    );
    console.log("Update Joinnnnn Chat Result:", updateResult);

    const to_user=await User.findById(data.to);

    // Broadcast a user status update to all users in the chat room
    const userStatusUpdate = {
      user_id: data.from,
      status: "Joined",
    };
    io.to(to_user?.socket_id).emit("user_joined_room", userStatusUpdate);
  });

  socket.on("end", async (data) => {
    try {
      // Find user by ID and set status as offline
      if (data.user_id) {
        await User.findByIdAndUpdate(data.user_id, { status: "Offline" });
        console.log(`User ${data.user_id} is now Offline`);
      }

      // Broadcast to all conversation rooms of this user that this user is offline (disconnected)
      socket.broadcast.emit("user_offline", { user_id: data.user_id });
      console.log(`Broadcasted user offline status for user ${data.user_id}`);

      // Close the connection
      console.log("Closing connection");
      socket.disconnect(0);
    } catch (error) {
      console.error('Error handling "end" event:', error.message);
    }
  });

  socket.on("disconnect", async () => {
    if (socket.handshake.query["user_id"]) {
      await User.findByIdAndUpdate(socket.handshake.query["user_id"], {
        status: "Offline",
      });
      // console.log(`User ${data.user_id} is now Offline`);
    }
    console.log("User disconnected:", socket.id);
    // Remove user from onlineUsersMap on disconnect
    // onlineUsersMap.delete(userId);
    // console.log(onlineUsersMap)
  });
});

server.listen(PORT, () => {
  console.log("Server Started Successfully");
});

function getChatRoomName(userA, userB) {
  // Ensures a consistent chat room name regardless of user order
  return [userA, userB].sort().join("-");
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("UNHANDLED REJECTION! Shutting down ...");
  server.close(() => {
    process.exit(1); //  Exit Code 1 indicates that a container shut down, either because of an application failure.
  });
});
