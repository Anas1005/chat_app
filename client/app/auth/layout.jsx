'use client'
import React from "react";
import { Container, Stack } from "@mui/material";
import Navigate from "@/components/Navigate";
import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";

// import Logo from "../../assets/Images/logo.ico";
// import { useSelector } from "react-redux";

const AuthLayout = ({children}) => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  if(isLoggedIn){
    return <Navigate to="/dashboard" replace />
  }

//   if (isLoggedIn) {
//     return <Navigate to={"/app"} />;
//   }

  return (
    <>
      <Container sx={{ mt: 5 }} maxWidth="sm">
        <Stack spacing={5}>
          <Stack
            sx={{ width: "100%" }}
            direction="column"
            alignItems={"center"}
          >
            <img style={{ height: 120, width: 120 }} src="/assets/Images/logo.ico" alt="Logo" />
          </Stack>
          {children}
        </Stack>
      </Container>
    </>
  );
};

export default AuthLayout;