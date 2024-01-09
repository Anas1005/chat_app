// SocketProvider.js
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  SetDirectConversations,
  UpdateDirectConversation,
  AddDirectConversation,
  SetCurrentMessages,
  AddDirectMessage,
  SetCurrentConversation,
} from "@/redux/slices/conversationSlice";
import {
  SelectConversation,
  SetNotifications,
  FetchUsers,
  FetchFriends,
  FetchFriendRequests,
  SetOnlineUsers,
  UserOnline,
  UserOffline,
  SetTypingUsers,
} from "@/redux/slices/appSlice";

import { socket } from "@/socket";
// import { io } from 'socket.io-client';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { isLoggedIn, user_id } = useSelector((state) => state.auth);
  const { current_conversation, conversations, current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { room_id } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Socket In AppConetxt", socket);

    socket?.on("get_online_users", (data) => {
      console.log("OnlineUsers Fetched", data.onlineUsers);
      dispatch(SetOnlineUsers({ onlineUsers: data.onlineUsers }));
    });

    socket?.on("user_online", (data) => {
      console.log("New OnlineUsee", data.user_id);
      dispatch(UserOnline({ user_id: data.user_id }));

      if (room_id !== null) {
        const current = conversations?.find((el) => el?.id === room_id);
        if (current?.user_id === data.user_id) {
          getCurrentMessages();
        }
      }
      getDirectConversations();
    });

    socket?.on("user_joined_room", (data) => {
      console.log("A User Joined Room", data.user_id);
      if (room_id !== null) {
        const current = conversations?.find((el) => el?.id === room_id);
        if (current?.user_id === data.user_id) {
          getCurrentMessages();
        }
      }
      console.log("Before GDC.....");
      getDirectConversations();
    });

    socket?.on("user_offline", (data) => {
      console.log("New OfflineUser", data.user_id);
      dispatch(UserOffline({ user_id: data.user_id }));
    });

    // socket?.on("Checking", (data) => {
    //   console.log(data);
    // });

    socket?.on("request_sent", (data) => {
      console.log("Request Sent");
      toast.success(data.message);
      dispatch(FetchUsers());
    });

    socket?.on("new_friend_request", (data) => {
      // toast.success(data.message);
      getNotifications();
      // dispatch(FetchFriendRequests());
    
      const audioElement = document.getElementById('notificationSound');
      console.log("Audio",audioElement)
      if (audioElement) {
        audioElement.play();
      }
    });


    socket?.on("request_accepted", (data) => {
      // toast.success(data.message);
      getNotifications();
      const audioElement = document.getElementById('notificationSound');
      if (audioElement) {
        audioElement.play();
      }
      // dispatch(FetchFriends());
    });

    socket?.on("start_chat", (data) => {
      console.log(data);
      // add / update to conversation list
      console.log("Strating The Chat...");
      const existing_conversation = conversations?.find(
        (el) => el?.id === data._id
      );
      if (existing_conversation) {
        // update direct conversation
        dispatch(UpdateDirectConversation({ conversation: data, user_id }));
      } else {
        // add direct conversation
        dispatch(AddDirectConversation({ conversation: data, user_id }));
      }

      dispatch(SelectConversation({ room_id: data._id }));
    });

    socket?.on("new_message", (data) => {
      console.log(
        "Inside New Message" + ":" + room_id + ":" + data.conversation_id
      );
      const message = data.message;
      console.log(current_conversation?.id);
      // console.log("ID" + "-"+current_conversation?.id+ "-"+ data.conversation_id);
      // console.log("ID" + "-"+room_id+ "-"+ data.conversation_id);
      // check if msg we got is from currently selected conversation
      if (room_id === data.conversation_id) {
        console.log("HelloMatched");
        dispatch(
          AddDirectMessage({
            // id: message._id,
            type: "msg",
            subtype: message.subtype,
            text: message.text,
            incoming: message.to === user_id,
            outgoing: message.from === user_id,
            createdAt: message.createdAt,
            status: message.status,
          })
        );
      }

      getDirectConversations();
      if (
        message?.to === user_id &&
        (message?.status === "Delivered" || message?.status === "Sent")
      ) {
        getNotifications();
        const audioElement = document.getElementById('notificationSound');
        if (audioElement) {
          audioElement.play();
        }
      }
    });

    socket?.on("user_started_typing",(data)=>{
      console.log("User Stated Typing",data.user_id)
      dispatch(SetTypingUsers({user_id:data.user_id}))

    })
    socket?.on("user_stopped_typing",(data)=>{
      console.log("User StoppedTyping",data.user_id)
      dispatch(SetTypingUsers({user_id:data.user_id}))

    })

    return () => {
      socket?.off("get_online_users");
      socket?.off("user_online");
      socket?.off("usr_joined_room");
      socket?.off("user_offline");
      socket?.off("user_started_typing");
      socket?.off("user_stopped_typing");
      socket?.off("request_sent");
      socket?.off("new_friend_request");
      socket?.off("request_accepted");
      socket?.off("start_chat");
      socket?.off("new_message");
      
    };
  }, [
    socket,
    isLoggedIn,
    user_id,
    room_id,
    current_conversation,
    conversations,
  ]);

  const sendFriendRequest = (data) => {
    setLoading(true);
    socket?.emit("friend_request", data, () => {
      // alert("request sent");
      setLoading(false);
    });
  };

  const acceptFriendRequest = (data) => {
    setLoading(true);
    socket?.emit("accept_request", data, () => {
      dispatch(FetchFriendRequests())
      setLoading(false);
    });
  };

  const getNotifications = () => {
    console.log("Fetching Notifications...");
    socket?.emit("get_notifications", { user_id }, (data) => {
      console.log("Data", data);
      dispatch(SetNotifications({ notifications: data }));
    });
  };

  const startConversation = (data) => {
    setLoading(true);
    socket?.emit("start_conversation", data, () => {
      setLoading(false);
    });
  };

  const getDirectConversations = async () => {
    console.log("Before Emitting", socket);
    socket?.emit("get_direct_conversations", { user_id }, (data) => {
      console.log("Getting DC In CallBack", data); // this data is the list of conversations
      // dispatch action

      dispatch(SetDirectConversations({ conversationList: data, user_id }));
    });
    console.log("Emitted");
  };

  const joinChatRoom = () => {
    const current = conversations?.find((el) => el?.id === room_id);
    socket?.emit("join_chat_room", { from: user_id, to: current?.user_id });
  };

  const getCurrentMessages = () => {
    const current = conversations?.find((el) => el?.id === room_id);
    // console.log("Room Use",socket);
    // console.log("Current",current);

    socket?.emit("get_messages", { conversation_id: current?.id }, (data) => {
      // data => list of messages
      // console.log("List of messages");
      dispatch(SetCurrentMessages({ messages: data, user_id }));
    });

    dispatch(SetCurrentConversation(current));
  };

  const sendMessage = async (message) => {
    console.log("In AppConetext Send Message", socket);
    socket?.emit("send_message", message);
  };

  const startTyping = async(data)=>{
    socket?.emit("start_typing",data)
  }
  const stopTyping = async(data)=>{
    socket?.emit("stop_typing",data)
  }



  const value = {
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    startConversation,
    getDirectConversations,
    getNotifications,
    joinChatRoom,
    getCurrentMessages,
    sendMessage,
    startTyping,
    stopTyping
    // socket,
    // initializeSocket,
    // disconnectSocket
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
