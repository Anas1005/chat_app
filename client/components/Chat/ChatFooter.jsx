"use client";
import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  FaCamera,
  FaFile,
  FaImage,
  FaLink,
  FaPaperPlane,
  FaSmile,
  FaUser,
} from "react-icons/fa";
import { PiStickerLight } from "react-icons/pi";
//   import {
//     Camera,
//     File,
//     Image,
//     LinkSimple,
//     PaperPlaneTilt,
//     Smiley,
//     Sticker,
//     User,
//   } from "phosphor-react";
import { useTheme, styled } from "@mui/material/styles";
import React, { useRef, useState, useContext } from "react";
import useResponsive from "@/hooks/useResponsive";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
// import { socket } from "@/socket";
//   import { socket } from "../../socket";
import { useSelector } from "react-redux";
import { SocketContext } from "@/contexts/SocketContext";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px !important",
    paddingBottom: "12px !important",
  },
}));

const Actions = [
  {
    color: "#4da5fe",
    icon: <FaImage size={16} />,
    y: 102,
    title: "Photo/Video",
    subtype:"img-video"
  },
  {
    color: "#1b8cfe",
    icon: <PiStickerLight size={16} />,
    y: 172,
    title: "Stickers",
    subtype:"sticker"
  },
  {
    color: "#0172e4",
    icon: <FaCamera size={16} />,
    y: 242,
    title: "Image",
    subtype:"img"
  },
  {
    color: "#0159b2",
    icon: <FaFile size={16} />,
    y: 312,
    title: "Document",
    subtype:"doc"
  },
  {
    color: "#013f7f",
    icon: <FaUser size={16} />,
    y: 382,
    title: "Contact",
    subtype:"contact"
  },
];

const ChatInput = ({
  openPicker,
  setOpenPicker,
  setValue,
  value,
  inputRef,
  subtype, 
  setSubtype,
}) => {
  const [openActions, setOpenActions] = React.useState(false);
  const { user_id } = useSelector((state) => state.auth);
  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const {startTyping, stopTyping} = useContext(SocketContext);

  return (
    <StyledInput
      inputRef={inputRef}
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      fullWidth
      placeholder="Write a message..."
      variant="filled"
      onFocus={() => {
        console.log("Focussed....")
        startTyping({from:user_id,to:current_conversation?.user_id});  // Call the start typing handler
      }}
      onBlur={() => {
        console.log("Blurred....")
        stopTyping({from:user_id,to:current_conversation?.user_id});  // Call the stop typing handler
      }}
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <Stack sx={{ width: "max-content" }}>
            <Stack
              sx={{
                position: "relative",
                display: openActions ? "inline-block" : "none",
              }}
            >
              {Actions.map((el,idx) => (
                <Tooltip placement="right" key={idx} title={el.title}>
                  <Fab
                    onClick={() => {
                      // setOpenActions(!openActions);
                      setSubtype(el.subtype);
                    }}
                    sx={{
                      position: "absolute",
                      top: -el.y,
                      backgroundColor: "#826AF9",
                    }}
                    aria-label="add"
                  >
                    {el.icon}
                  </Fab>
                </Tooltip>
              ))}
            </Stack>

            <InputAdornment>
              <IconButton
                onClick={() => {
                  setOpenActions(!openActions);
                }}
              >
                <FaLink />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
        //   ),,)
        endAdornment: (
          <Stack sx={{ position: "relative" }}>
            <InputAdornment>
              <IconButton
                onClick={() => {
                  setOpenPicker(!openPicker);
                }}
              >
                <FaSmile />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
      }}
    />
  );
};

function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) => `<a href="${url}" target="_blank">${url}</a>`
  );
}

function containsUrl(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return urlRegex.test(text);
}

const Footer = () => {
  const theme = useTheme();
  const {sendMessage} = useContext(SocketContext);

  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );

  const { user_id } = useSelector((state) => state.auth);

  const [subtype, setSubtype] = useState("");
  console.log("SubType",subtype)

  // const user_id = window.localStorage.getItem("user_id");

  const isMobile = useResponsive("between", "md", "xs", "sm");

  const { sideBar, room_id } = useSelector((state) => state.app);

  const [openPicker, setOpenPicker] = React.useState(false);

  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  function handleEmojiClick(emoji) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setValue(
        value.substring(0, selectionStart) +
          emoji +
          value.substring(selectionEnd)
      );

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "transparent !important",
      }}
    >
      <Box
        p={isMobile ? 1 : 2}
        width={"100%"}
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack direction="row" alignItems={"center"} spacing={isMobile ? 1 : 3}>
          <Stack sx={{ width: "100%" }}>
            <Box
              style={{
                zIndex: 10,
                position: "fixed",
                display: openPicker ? "inline" : "none",
                bottom: 81,
                // right: 100,
                  right: isMobile ? 20 : sideBar.open ? 420 : 100,
                //   right: isMobile ? 20
              }}
            >
              <Picker
                theme={theme.palette.mode}
                data={data}
                onEmojiSelect={(emoji) => {
                  handleEmojiClick(emoji.native);
                }}
              />
            </Box>
            {/* Chat Input */}
            <ChatInput
              inputRef={inputRef}
              value={value}
              setValue={setValue}
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
              subtype={subtype}
              setSubtype={setSubtype}
            />
          </Stack>
          <Box
            sx={{
              height: 48,
              width: 48,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5,
            }}
          >
            <Stack
              sx={{ height: "100%" }}
              alignItems={"center"}
              justifyContent="center"
            >
              <IconButton
                onClick={() => {
                  console.log("Clicked...")
                  // socket.emit("send_message", {
                  //   conversation_id: room_id,
                  //   from: user_id,
                  //   to: current_conversation.user_id,
                  //   type:"msg",
                  //   text: linkify(value),
                  //   subtype:containsUrl(value) ? "link" : subtype
                  // });

                  sendMessage({
                    conversation_id: room_id,
                    from: user_id,
                    to: current_conversation.user_id,
                    type:"msg",
                    text: linkify(value),
                    subtype:containsUrl(value) ? "link" : subtype
                  })
                  
                }}
              >
                <FaPaperPlane color="#ffffff" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
