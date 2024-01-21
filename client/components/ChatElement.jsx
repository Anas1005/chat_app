"use client";
import React from "react";
import { Box, Badge, Stack, Avatar, Typography } from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
// import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoCheckmark, IoCheckmarkDoneOutline } from "react-icons/io5";
import { SelectConversation } from "@/redux/slices/appSlice";
import { ResetUnreadCountOfDC } from "@/redux/slices/conversationSlice";
import MessengerTypingAnimation from "./Chat/TypingAnimation";
// import { SelectConversation } from "../redux/slices/app";

const truncateText = (string, n) => {
  return string?.length > n ? `${string?.slice(0, n)}...` : string;
};

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const ChatElement = ({
  id,
  user_id,
  img,
  name,
  msg,
  time,
  outgoing,
  status,
  unread,
  pinned,
}) => {
  const dispatch = useDispatch();
  const { room_id, onlineUsers, typingUsers } = useSelector(
    (state) => state.app
  );
  const iconStyle = {
    fontSize: "1.2rem", // Adjust the size as needed
    color: status === "Seen" ? "#04e813" : "#f2f3f2", // Adjust the colors as needed
  };
  console.log("In Chat Element", onlineUsers);
  const selectedChatId = room_id?.toString();

  let online = onlineUsers?.includes(user_id);
  let isFriendTyping = typingUsers?.includes(user_id);
  let isSelected = selectedChatId === id;

  //   if (!selectedChatId) {
  //     isSelected = false;
  //   }

  const theme = useTheme();

  const formatDate = (createdAt) => {
    const currentDate = new Date();
    const messageDate = new Date(createdAt);

    // Check if the message was sent today
    if (
      messageDate.getDate() === currentDate.getDate() &&
      messageDate.getMonth() === currentDate.getMonth() &&
      messageDate.getFullYear() === currentDate.getFullYear()
    ) {
      // Format as HH:MM if sent today
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // Check if the message was sent yesterday
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);

      if (
        messageDate.getDate() === yesterday.getDate() &&
        messageDate.getMonth() === yesterday.getMonth() &&
        messageDate.getFullYear() === yesterday.getFullYear()
      ) {
        return "Yesterday";
      } else {
        // Format as DD/MM/YY if not today or yesterday
        const day = messageDate.getDate().toString().padStart(2, "0");
        const month = (messageDate.getMonth() + 1).toString().padStart(2, "0");
        const year = messageDate.getFullYear().toString().slice(-2);

        return `${day}/${month}/${year}`;
      }
    }
  };

  // Usage

  return (
    <StyledChatBox
      onClick={() => {
        dispatch(SelectConversation({ room_id: id }));
        dispatch(ResetUnreadCountOfDC({ conversationId: id }));
      }}
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: isSelected
          ? theme.palette.mode === "light"
            ? alpha(theme.palette.primary.main, 0.5)
            : theme.palette.primary.main
          : theme.palette.mode === "light"
          ? "#fff"
          : theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          {" "}
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2" fontSize="0.9rem">
              {name}
            </Typography>

            {isFriendTyping ? (
              <MessengerTypingAnimation />
            ) : outgoing ? (
              <Box display="flex" alignItems="center" columnGap="4px">
                {status === "Sent" && <IoCheckmark style={iconStyle} />}{" "}
                {/* Tick */}
                {status === "Delivered" && (
                  <IoCheckmarkDoneOutline style={iconStyle} />
                )}{" "}
                {/* Double Tick */}
                {status === "Seen" && (
                  <IoCheckmarkDoneOutline style={iconStyle} />
                )}{" "}
                {/* Green Double Tick */}
                <Typography
                  variant="caption"
                  color="#c5c5c5"
                  fontSize="0.825rem"
                >
                  {truncateText(msg, 20)}
                </Typography>
              </Box>
            ) : (
              <Typography variant="caption" color="#c5c5c5" fontSize="0.825rem">
                {truncateText(msg, 20)}
              </Typography>
            )}
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems={"center"}>
          {msg && (
            <Typography sx={{ fontWeight: 600 }} variant="caption">
              {formatDate(time)}
            </Typography>
          )}
          <Badge
            className="unread-count"
            color="primary"
            badgeContent={unread}
          />
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export default ChatElement;
