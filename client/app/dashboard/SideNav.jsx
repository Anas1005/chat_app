"use client";
import React from "react";
import { useTheme } from "@mui/material/styles";

import { Box, Divider, IconButton, Stack } from "@mui/material";
import AntSwitch from "@/components/AntSwitch";
// import Logo from ".../public/assets/Images/logo.ico";

import useSettings from "@/hooks/useSettings";
import { Nav_Buttons, Nav_Setting } from "@/data";
import { motion } from "framer-motion";
import ProfileMenu from "./ProfileMenu";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { UpdateTab } from "@/redux/slices/appSlice";


const getPath = (index) => {
  switch (index) {
    case 0:
      return "/dashboard";

    case 1:
      return "/dashboard/group";

    case 2:
      return "/dashboard/call";

    case 3:
      return "/dashboard/settings";

    default:
      break;
  }
};

const SideNav = () => {
  const theme = useTheme();
    const dispatch = useDispatch();

    const { tab } = useSelector((state) => state.app);

    const router = useRouter();

    const { onToggleMode } = useSettings();

    console.log("Mode-",theme.palette.mode);

    const selectedTab = tab;

  //   const 1 = tab;

    const handleChangeTab = (index) => {
      dispatch(UpdateTab({ tab: index }));
      router.push(getPath(index));
    };

  return (
    <Box
      sx={{
        height: "100vh",
        width: 100,

        backgroundColor:
          theme.palette.mode === "light"
            ? "#F0F4FA"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Stack
        py={3}
        alignItems={"center"}
        justifyContent="space-between"
        sx={{ height: "100%" }}
      >
        <Stack alignItems={"center"} spacing={4}>
          <Box
            sx={{
              height: 64,
              width: 64,
              borderRadius: 1.5,
              backgroundColor: theme.palette.primary.main,
            }}
            p={1}
          >
            <Image src="/assets/Images/logo.ico" alt="Tawk" width={50} height={50} />
          </Box>
          <Stack
            sx={{ width: "max-content" }}
            direction="column"
            alignItems={"center"}
            spacing={3}
          >
            {Nav_Buttons.map((el) => {
              return el.index == selectedTab ? (
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 1.5,
                  }}
                  p={1}
                >
                  <IconButton
                    onClick={() => {
                        handleChangeTab(el.index);
                    }}
                    sx={{ width: "max-content", color: "#ffffff" }}
          
                  >
                    {el.icon}
                  </IconButton>
                </Box>
              ) : (
                <IconButton
                  onClick={() => {
                    handleChangeTab(el.index);
                  }}
                  component={motion.div}
                  whileHover={{
                    scale: 1.2,
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 1 }}
                  sx={{
                    width: "max-content",
                    color:
                      theme.palette.mode === "light"
                        ? "#080707"
                        : theme.palette.text.primary,
                  }}
                >
                  {el.icon}
                </IconButton>
              );
            })}
            <Divider sx={{ width: 48 }} />
            {Nav_Setting.map((el) => {
              return el.index == selectedTab ? (
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 1.5,
                  }}
                  p={1}
                >
                  <IconButton
                    onClick={() => {
                        handleChangeTab(el.index);
                    }}
                    sx={{ width: "max-content", color: "#ffffff" }}
                  >
                    {el.icon}
                  </IconButton>
                </Box>
              ) : (
                <IconButton
                  onClick={() => {
                    handleChangeTab(el.index);
                    dispatch(UpdateTab(el.index));
                  }}
                  sx={{
                    width: "max-content",
                    color:
                      theme.palette.mode === "light"
                        ? "#080707"
                        : theme.palette.text.primary,
                  }}
                >
                  {el.icon}
                </IconButton>
              );
            })}
          </Stack>
        </Stack>
        <Stack spacing={4}>
          <AntSwitch
            defaultChecked={theme.palette.mode === "dark"}
            onChange={onToggleMode}
          />
          {/* Profile Menu */}
          <ProfileMenu />
        </Stack>
      </Stack>
    </Box>
  );
};

export default SideNav;
