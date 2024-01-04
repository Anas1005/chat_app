// NotificationDialog.js
"use client";

import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  Stack,
  Paper,
  Slide,
  Typography,
  IconButton,
  Avatar,
  Badge,
} from "@mui/material";

import { RxCross2 } from "react-icons/rx";
import { motion } from "framer-motion";
import { faker } from "@faker-js/faker";
import {
  MarkNotificationAsRead,
  RemoveNotification,
} from "@/redux/slices/appSlice";
import "./scrollBar.css";
import { IoCheckmark } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Notification = ({ _id, type, sender, createdAt, read }) => {
  const dispatch = useDispatch();
  const handleMarkAsRead = () => {
    dispatch(MarkNotificationAsRead({ notificationId: _id }));
  };

  const handleRemoveNotification = () => {
    console.log("Remove Notification clicked");
    dispatch(RemoveNotification({ notificationId: _id }));
  };

  return (
    <Paper
      elevation={3}
      component={motion.div}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1, transition: { duration: 1 } }}
      whileHover={{
        backgroundColor: "rgb(25 ,33, 41)",
        transition: { duration: 0.3 },
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px",
        cursor: "pointer",
        backgroundColor: read ? "inherit" : "rgb(46 54 63)", // Add background color for read notifications
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          style={{ marginRight: "8px" }}
        >
          <Avatar alt={sender?.firstName} src={faker.image.avatar()} />
        </Badge>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "4px",
          }}
        >
          <Box>
            <span style={{ fontWeight: "bold" }}>
              {sender?.firstName} {sender?.lastName}
            </span>
            <span>
              {type === "MESSAGE"
                ? " sent you a message: "
                : type === "FRIEND_REQUEST"
                ? " sent you a friend request: "
                : type === "ACCEPT_FRIEND_REQUEST"
                ? " accepted your friend request: "
                : ""}
            </span>
          </Box>
          <Typography
            style={{ color: "#999", fontSize: "0.8rem", marginTop: "4px" }}
          >
            {new Date(createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Typography>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {!read && (
          <IconButton onClick={handleMarkAsRead} style={{ marginRight: "8px" }}>
            <IoCheckmark color="primary" />
          </IconButton>
        )}
        <IconButton onClick={handleRemoveNotification}>
          <RxCross2 color="error" />
        </IconButton>
      </div>
    </Paper>
  );
};

const NotificationDialog = ({ open, handleClose }) => {
  // Sample Notifications
  // const sampleNotifications = [
  //   {
  //     type: 'MESSAGE',
  //     sender: 'JohnDoe',
  //     content: 'Hi there!',
  //     timestamp: new Date(),
  //     img: faker.image.avatar(),
  //     name: 'John Doe',
  //     read: false,
  //   },
  //   {
  //     type: 'FRIEND_REQUEST',
  //     sender: 'JaneSmith',
  //     content: 'Wants to be your friend.',
  //     timestamp: new Date(),
  //     img: faker.image.avatar(),
  //     name: 'Jane Smith',
  //     read: true,
  //   },
  //   {
  //     type: 'MESSAGE',
  //     sender: 'AliceJones',
  //     content: 'How are you?',
  //     timestamp: new Date(),
  //     img: faker.image.avatar(),
  //     name: 'Alice Jones',
  //     read: false,
  //   },
  //   {
  //     type: 'FRIEND_REQUEST',
  //     sender: 'BobJohnson',
  //     content: 'Sent you a friend request.',
  //     timestamp: new Date(),
  //     img: faker.image.avatar(),
  //     name: 'Bob Johnson',
  //     read: true,
  //   },
  //   {
  //     type: 'MESSAGE',
  //     sender: 'EvaWhite',
  //     content: 'What are you up to?',
  //     timestamp: new Date(),
  //     img: faker.image.avatar(),
  //     name: 'Eva White',
  //     read: false,
  //   },
  //   {
  //     type: 'FRIEND_REQUEST',
  //     sender: 'CharlieBrown',
  //     content: 'Wants to connect with you.',
  //     timestamp: new Date(),
  //     img: faker.image.avatar(),
  //     name: 'Charlie Brown',
  //     read: true,
  //   },
  //   {
  //     type: 'MESSAGE',
  //     sender: 'GraceMiller',
  //     content: 'Hello!',
  //     timestamp: new Date(),
  //     img: faker.image.avatar(),
  //     name: 'Grace Miller',
  //     read: false,
  //   },
  //   {
  //     type: 'FRIEND_REQUEST',
  //     sender: 'CharlieBrown',
  //     content: 'Wants to connect with you.',
  //     timestamp: new Date(),
  //     img: faker.image.avatar(),
  //     name: 'Charlie Brown',
  //     read: true,
  //   },
  // ];
  const { notifications } = useSelector((state) => state.app.notification);
  console.log("In Dialog", notifications);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <Paper>
        <Tabs value={0} onChange={() => {}} centered>
          <Tab label="Notifications" />
          {/* Add more tabs if needed */}
        </Tabs>
      </Paper>
      <DialogContent
        sx={{ height: "100%", flexGrow: 1, overflowY: "scroll" }}
        className=" custom-scrollbar "
      >
        <Stack>
          <Stack spacing={1}>
            {notifications?.map((notification, index) => (
              <Notification key={index} {...notification} />
            ))}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
