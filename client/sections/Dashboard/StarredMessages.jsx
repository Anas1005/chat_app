"use client";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { FaAngleDoubleLeft } from "react-icons/fa";
// import { ArrowLeft } from "phosphor-react";
import useResponsive from "@/hooks/useResponsive";
import { useDispatch } from "react-redux";
import { UpdateSidebarType } from "@/redux/slices/appSlice";
import "./scrollBar.css";
import { Conversation } from "@/app/dashboard/conversation/page";

const StarredMessages = () => {
  const dispatch = useDispatch();

  const theme = useTheme();

  const isDesktop = useResponsive("up", "md");

  return (
    <Box sx={{ width: !isDesktop ? "100vw" : "20%", maxHeight: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack
            sx={{ height: "100%", p: 2 }}
            direction="row"
            alignItems={"center"}
            spacing={3}
          >
            <IconButton
              onClick={() => {
                dispatch(UpdateSidebarType("CONTACT"));
              }}
            >
              <FaAngleDoubleLeft />
            </IconButton>
            <Typography variant="subtitle2">Starred Messages</Typography>
          </Stack>
        </Box>
        <Stack
          className="custom-scrollbar"
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflowY: "scroll",
          }}
          spacing={3}
        >
          <Conversation />
        </Stack>
      </Stack>
    </Box>
  );
};

export default StarredMessages;
