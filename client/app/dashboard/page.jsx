"use client";
import React from "react";
import { useTheme } from "@mui/material/styles";
import Chats from "./chats/page";
import { Box, Stack,Typography } from "@mui/material";
import ChatComponent from "./conversation/page";
import Link from "next/link";
import Contact from "@/sections/Dashboard/Contact";
import Media from "@/sections/Dashboard/SharedMessages";
import NoChat from "@/public/assets/Illustration/NoChat";
import StarredMessages from "@/sections/Dashboard/StarredMessages";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const GeneralApp = () => {
  const theme = useTheme();
  const { sideBar, room_id, chat_type } = useSelector((state) => state.app);
  console.log("In General App")

  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        <Chats />
        <Box
          sx={{
            height: "100%",
            width: sideBar.open
              ? `calc(100vw - 760px )`
              : "calc(100vw - 475px )",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#FFF"
                : theme.palette.background.paper,
            // borderBottom:
            //   searchParams.get("type") === "individual-chat" &&
            //   searchParams.get("id")
            //     ? "0px"
            //     : "6px solid #0162C4",
          }}
          className=" tw-transition-all tw-duration-300 tw-ease-linear "
        >
          {chat_type === "individual" && room_id !== null ? (
            <ChatComponent />
          ) : (
            <Stack
              spacing={2}
              sx={{ height: "100%", width: "100%" }}
              alignItems="center"
              justifyContent={"center"}
            >
              <NoChat />
              <Typography variant="subtitle2">
                Select a conversation or start a{" "}
                <Link
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                  }}
                  href="/"
                >
                  new one
                </Link>
              </Typography>
            </Stack>
          )}
        </Box>

        {sideBar?.open&&
          (() => {
            switch (sideBar?.type) {
              case "CONTACT":
                return <Contact />;

              case "STARRED":
                return <StarredMessages />;

              case "SHARED":
                return <Media />;

              default:
                break;
            }
          })()}
      </Stack>
    </>
  );
};

export default GeneralApp;
