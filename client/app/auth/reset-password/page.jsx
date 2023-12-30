'use client'
import { Stack, Typography} from "@mui/material";
import Link from "next/link";
import React from "react";
import { FaCaretLeft } from "react-icons/fa";
import ResetPasswordForm from "@/sections/Auth/ResetPassword";

const ResetPassword = () => {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h3" paragraph>
          Forgot your password?
        </Typography>

        <Typography sx={{ color: "text.secondary", mb: 5 }}>
          Please enter the email address associated with your account and We
          will email you a link to reset your password.
        </Typography>
      </Stack>

      {/* Reset Password Form */}
      <ResetPasswordForm />

      <Link
        href={"/auth/login"}
        className=" mt-3 tw-mx-auto tw-items-center tw-inline-flex"
      >
        <FaCaretLeft size={24} />
        Return to sign in
      </Link>
    </>
  );
};

export default ResetPassword;