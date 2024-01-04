"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Badge,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { socket } from "@/socket";
import { useTheme } from "@mui/material/styles";
import useResponsive from "@/hooks/useResponsive";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import BottomNav from "../BottomNav";
import ChatElement from "@/components/ChatElement";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "@/components/Search";
import { FaArchive, FaSearch} from "react-icons/fa";
import { SocketContext } from "@/contexts/SocketContext";
import All from "@/sections/Dashboard/All";
import { useDispatch, useSelector } from "react-redux";
import "./scrollBar.css";

import NotificationDialog from "@/sections/Dashboard/NotificationDialog";



const Chats = () => {
  const theme = useTheme();
  const { getDirectConversations, getNotifications } = useContext(SocketContext);
  const isDesktop = useResponsive("up", "md");
  const { user_id, isLoggedIn } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { conversations, current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const {unreadCount} = useSelector((state)=>state.app.notification)
  console.log("Inside ChatList", conversations);
  const sortedConversations = [...conversations].sort((a, b) => {
    // Assuming 'time' is in the format HH:mm AM/PM
    return new Date(b.time) - new Date(a.time);
  });

  useEffect(() => {
    console.log("Getting DC Inside UE", socket);
    getDirectConversations();
    getNotifications();
  }, []);

  const [openDialog, setOpenDialog] = useState(false);
  const [openNotificationDialog, setOpenNotDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseNotDialog = () => {
    setOpenNotDialog(false);
  };
  const handleOpenNotDialog = () => {
    setOpenNotDialog(true);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "100%",
          width: isDesktop ? 375 : "100vw",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,

          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        {!isDesktop && (
          // Bottom Nav
          <BottomNav />
        )}

        <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
          <Stack
            alignItems={"center"}
            justifyContent="space-between"
            direction="row"
          >
            <Typography variant="h5">Chats</Typography>

            <Stack direction={"row"} alignItems="center" spacing={1}>
              <IconButton
                onClick={() => {
                  handleOpenDialog();
                }}
                sx={{ width: "max-content" }}
              >
                <HiOutlineUsers />
              </IconButton>
              <IconButton
                onClick={() => {
                  handleOpenNotDialog();
                }}
                sx={{ width: "max-content", position: "relative" }}
              >
                <IoIosNotificationsOutline />
                {unreadCount > 0 && (
                  <Badge
                    color="error"
                    badgeContent={unreadCount}
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 8,
                    }}
                  />
                )}
              </IconButton>
            </Stack>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <FaSearch color="#709CE6" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onClick={() => socket?.emit("check", "Hello Server")}
              />
            </Search>
          </Stack>
          <Stack spacing={1}>
            <Stack direction={"row"} spacing={1.5} alignItems="center">
              <FaArchive size={24} />
              <Button variant="text">Archive</Button>
            </Stack>
            <Divider />
          </Stack>
          <Stack
            sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
            className=" custom-scrollbar "
          >
            {/* <SimpleBarStyle timeout={500} clickOnTrack={false}> */}
            <Stack spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                Pinned
              </Typography>
              {/* Chat List */}
              {sortedConversations
                ?.filter((el) => el.pinned)
                .map((el, idx) => {
                  return <ChatElement key={idx} {...el} />;
                })}
              <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                All Chats
              </Typography>
              {/* Chat List */}
              {sortedConversations
                ?.filter((el) => !el.pinned)
                .map((el, idx) => {
                  return <ChatElement key={idx} {...el} />;
                })}
            </Stack>
            {/* </SimpleBarStyle> */}
          </Stack>
        </Stack>
      </Box>
      {openDialog && <All open={openDialog} handleClose={handleCloseDialog} />}
      {openNotificationDialog && (
        <NotificationDialog
          open={openNotificationDialog}
          handleClose={handleCloseNotDialog}
        />
      )}
    </>
  );
};

export default Chats;
