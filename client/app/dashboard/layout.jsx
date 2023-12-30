'use client'
import { useSelector } from "react-redux";
import SideNav from "./SideNav";
import Navigate from "@/components/Navigate";
import { Stack } from "@mui/material";
import { AddDirectConversation, UpdateDirectConversation, AddDirectMessage } from "@/redux/slices/conversationSlice";
import { SelectConversation } from "@/redux/slices/appSlice";
import { socket, connectSocket } from "@/socket";
import { useDispatch } from "react-redux";
import { SocketContext } from "@/contexts/SocketContext";
import { useEffect, useState } from "react";
// import { useContext } from "react";
import toast from "react-hot-toast";


export default function UsersLayout({
    children
  })
  
  {
    const {user_id} = useSelector((state) => state.auth);
    // const {socket, initializeSocket} = useContext(SocketContext);
    const { room_id , onlineUsers} = useSelector((state) => state.app);
    const{isLoggedIn}=useSelector((state)=>state.auth);
    const {current_conversation, conversations} = useSelector((state)=>state.conversation.direct_chat);
    console.log("CurrenTConv",current_conversation);
    console.log("OnelineUuuusers",onlineUsers);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    // console.log("ISSocket",isSocketConnected)
    console.log("Socket In Dash",socket)

    console.log("In DashLayOut OutUE",room_id)
    const dispatch=useDispatch();

    // useEffect(() => {
    //   console.log("In DashLayOut InUE",room_id)
    //   // console.log("Hello Dashboard just Outside");

    //   // const initSocket = async () => {

    //   //   if(!socket){
    //   //     initSocket();
    //   //   }
    //   //   // try {
    //   //   //   if (!socket) {
    //   //   //     console.log("Hello Dashboard Inside Insed");
    //   //   //     await connectSocket(user_id);
    //   //   //     console.log("Hello jii connecetd/..")
    //   //   //     setIsSocketConnected(true)

    //   //   //   }
    
    //   //   //   // rest of the code remains the same...
    //   //   // } catch (error) {
    //   //   //   console.error("Error connecting socket:", error);
    //   //   // }
    //   // }



    //   // if (isLoggedIn) {
    //   //   // if (typeof window !== 'undefined') {
    //   //   //   window.onload = function () {
    //   //   //     if (!window.location.hash) {
    //   //   //       window.location = window.location + "#loaded";
    //   //   //       window.location.reload();
    //   //   //     }
    //   //   //   };
    
    //   //   //   window.onload();
    //   //    console.log("Hello Dashboard Inside",socket);
    
    //   //     // if (!socket) {
    //   //     //   console.log("Hello Dashboard Inside Insed");
    //   //     //   connectSocket(user_id);
    //   //     // }

    //   //     initSocket();


    //   //   // }
    //   // }
     
      
    //   // if(socket==null){

    //   //   initSocket();

    //   // // }





    //   socket?.on("request_sent", (data) => {
    //     console.log("Request Sent");
    //     toast.success(data.message)
    //   });

    //   socket?.on("new_friend_request", (data) => {
    //       toast.success(data.message)
    //       // dispatch(FetchFriendRequests());
    //   });

    //   socket?.on("request_accepted", (data) => {
    //     toast.success(data.message)
    //     // dispatch(FetchFriends());
    //   });

    //   socket?.on("start_chat", (data) => {
    //     console.log(data);
    //     // add / update to conversation list
    //     const existing_conversation = conversations?.find(
    //       (el) => el?.id === data._id
    //     );
    //     if (existing_conversation) {
    //       // update direct conversation
    //       dispatch(UpdateDirectConversation({ conversation: data, user_id }));
    //     } else {
    //       // add direct conversation
    //       dispatch(AddDirectConversation({ conversation: data, user_id }));
    //     }

    //     dispatch(SelectConversation({ room_id: data._id }));
    //   });

    //   socket?.on("new_message", (data) => {
    //     console.log("Inside New Message"+":"+room_id+":"+
    //     data.conversation_id)
    //     const message = data.message;
    //     console.log(current_conversation?.id);
    //     // console.log("ID" + "-"+current_conversation?.id+ "-"+ data.conversation_id);
    //     // console.log("ID" + "-"+room_id+ "-"+ data.conversation_id);
    //     // check if msg we got is from currently selected conversation
    //     if (room_id === data.conversation_id) {
    //       console.log("HelloMatched");
    //       dispatch(
    //         AddDirectMessage({
    //           // id: message._id,
    //           type: "msg",
    //           subtype: message.subtype,
    //           text: message.text,
    //           incoming: message.to === user_id,
    //           outgoing: message.from === user_id,
    //         })
    //       );
    //     }
    //   });



    //   return () => {
    //     socket?.off("request_sent");
    //     socket?.off("new_friend_request");
    //     socket?.off("request_accepted");
    //     socket?.off("start_chat");
    //     socket?.off("new_message");
        

    //   };
    
    // }, [isLoggedIn, socket, user_id, conversations, current_conversation, room_id]);
    
    



    if(!isLoggedIn){
      return <Navigate to="/auth/login" replace />
    }
  

  //   const users = await getUsers();
  

  // if (!isSocketConnected) {
  //   return <div>Loading...</div>;
  // }

    return (
 
      <Stack direction="row">
      {/* {isDesktop && ( */}
        {/* // SideBar */}
        <SideNav />
      {/* )} */}
       {children}
      {/* <Outlet /> */}
    </Stack>
    );
  } 