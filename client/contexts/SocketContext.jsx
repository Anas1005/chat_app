// SocketProvider.js
'use client'

import React, { createContext, useContext, useEffect} from 'react';
import { SetDirectConversations, UpdateDirectConversation, AddDirectConversation,SetCurrentMessages, AddDirectMessage,SetCurrentConversation} from '@/redux/slices/conversationSlice';
import { SelectConversation } from '@/redux/slices/appSlice';
import { socket } from '@/socket';
// import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

export const SocketContext = createContext();

 export const SocketProvider = ({ children }) => {
  const SOCKET_SERVER_URL = 'http://localhost:4000';
  const {isLoggedIn,user_id}= useSelector((state)=>state.auth);
  const { current_conversation,conversations, current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const {room_id} = useSelector((state)=>state.app)
  const dispatch=useDispatch();





useEffect(() => {
    console.log("Socket In AppConetxt",socket)

    socket?.on("Checking",(data)=>{
        console.log(data);
      })

      
      socket?.on("request_sent", (data) => {
        console.log("Request Sent");
        toast.success(data.message)
      });

      socket?.on("new_friend_request", (data) => {
          toast.success(data.message)
          // dispatch(FetchFriendRequests());
      });

      socket?.on("request_accepted", (data) => {
        toast.success(data.message)
        // dispatch(FetchFriends());
      });

      socket?.on("start_chat", (data) => {
        console.log(data);
        // add / update to conversation list
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
        console.log("Inside New Message"+":"+room_id+":"+
        data.conversation_id)
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
              createdAt:message.createdAt
            })
          );
        }

        getDirectConversations();


      });



      return () => {
        socket?.off("request_sent");
        socket?.off("new_friend_request");
        socket?.off("request_accepted");
        socket?.off("start_chat");
        socket?.off("new_message");
        

      };


}, [socket,isLoggedIn,user_id, room_id, current_conversation,conversations])




const sendFriendRequest=(data)=>{
    socket.emit("friend_request", data, () => {
          // alert("request sent");
        });
}

const acceptFriendRequest=(data)=>{
    socket.emit("accept_request", data);
}

const startConversation=(data)=>{
    socket.emit("start_conversation", data);
}

const getDirectConversations=async()=>{
    console.log("UserID",user_id)
    socket?.emit("get_direct_conversations", { user_id }, (data) => {
        console.log("Getting DC In CallBack",data); // this data is the list of conversations
        // dispatch action
  
        dispatch(SetDirectConversations({ conversationList: data , user_id}));
      });
}

const getCurrentMessages=async()=>{
    const current = conversations?.find((el) => el?.id === room_id);
    // console.log("Room Use",socket); 
    // console.log("Current",current);

    socket?.emit("get_messages", { conversation_id: current?.id }, (data) => {
      // data => list of messages
      // console.log("List of messages");
      dispatch(SetCurrentMessages({ messages: data , user_id}));
    });

    dispatch(SetCurrentConversation(current));
}


const sendMessage=async(message)=>{
    console.log("In AppConetext Send Message",socket)
    socket?.emit("send_message",message);
}


  


 
  
//   useEffect(() => {
//     // Cleanup socket on component unmount
//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, [socket]);

  const value={
    sendFriendRequest,
    acceptFriendRequest,
    startConversation,
    getDirectConversations,
    getCurrentMessages,
    sendMessage
    // socket,
    // initializeSocket,
    // disconnectSocket
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
