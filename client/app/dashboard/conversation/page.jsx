"use client";
import { Stack, Box } from "@mui/material";
import React, { useEffect, useRef, useContext } from "react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "@/components/ScrollBar";
import { motion } from "framer-motion";
import { ChatHeader, ChatFooter } from "@/components/Chat";
import useResponsive from "@/hooks/useResponsive";
import { SocketContext } from "@/contexts/SocketContext";
// import { Chat_History } from "@/data";
// import { socket } from "@/socket";
import {
  DocMsg,
  LinkMsg,
  MediaMsg,
  ReplyMsg,
  TextMsg,
  Timeline,
} from "@/sections/Dashboard/Conversation";
import { useDispatch, useSelector } from "react-redux";
import "./scrollBar.css";
import {
  SetCurrentConversation,
  SetCurrentMessages,
} from "@/redux/slices/conversationSlice";

const Conversation = ({ isMobile, scrollRef }) => {
  const { user_id } = useSelector((state) => state.auth);
  const { joinChatRoom, getCurrentMessages } = useContext(SocketContext);
  const dispatch = useDispatch();

  const { conversations, current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { room_id } = useSelector((state) => state.app);
  // console.log("Room",room_id)

  useEffect(() => {
    // const current = conversations?.find((el) => el?.id === room_id);
    // console.log("Room Use",socket);
    // console.log("Current",current);

    // socket?.emit("get_messages", { conversation_id: current?.id }, (data) => {
    //   // data => list of messages
    //   // console.log("List of messages");
    //   dispatch(SetCurrentMessages({ messages: data , user_id}));
    // });

    // dispatch(SetCurrentConversation(current));
    if (room_id) {
      joinChatRoom();
      getCurrentMessages();
    }
  }, [room_id]);

  return (
    <Box p={isMobile ? 1 : 3}>
      <Stack
        spacing={3}
        component={motion.div}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ root: scrollRef }}
      >
        {current_messages?.map((el, idx) => {
          switch (el.type) {
            case "divider":
              return (
                // Timeline
                <Timeline key={idx} el={el} />
              );

            case "msg":
              switch (el.subtype) {
                case "img-video":
                  return (
                    // Media Message
                    <MediaMsg key={idx} el={el} />
                  );

                case "doc":
                  return (
                    // Doc Message
                    <DocMsg key={idx} el={el} />
                  );
                case "link":
                  return (
                    //  Link Message
                    <LinkMsg key={idx} el={el} />
                  );

                case "reply":
                  return (
                    //  ReplyMessage
                    <ReplyMsg key={idx} el={el} />
                  );

                default:
                  return (
                    // Text Message
                    <TextMsg key={idx} el={el} />
                  );
              }

            default:
              return <></>;
          }
        })}
      </Stack>
    </Box>
  );
};

const ChatComponent = () => {
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();

  const messageListRef = useRef(null);

  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );

  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [current_messages]);

  return (
    <Stack
      height={"100%"}
      maxHeight={"100vh"}
      width={isMobile ? "100vw" : "auto"}
    >
      {/*  */}
      <ChatHeader />
      <Box
        className=" custom-scrollbar"
        ref={messageListRef}
        width={"100%"}
        sx={{
          position: "relative",
          flexGrow: 1,
          overflowY: "scroll",

          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4FA"
              : theme.palette.background,

          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* <SimpleBarStyle timeout={500} clickOnTrack={false}> */}
        <Conversation isMobile={isMobile} scrollRef={messageListRef} />
        {/* </SimpleBarStyle> */}
      </Box>

      {/*  */}
      <ChatFooter />
    </Stack>
  );
};

export default ChatComponent;

export { Conversation };
