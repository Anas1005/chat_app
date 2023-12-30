'use client'

import { Stack, Typography} from "@mui/material";
import Link from "next/link";
import React from "react";
import { useSearchParams } from 'next/navigation'
import { FaCaretLeft } from "react-icons/fa";
import NewPasswordForm from "@/sections/Auth/NewPasswordForm";

const NewPassword = () => {
    const searchParams = useSearchParams()
 
    const passwordToken = searchParams.get('passwordToken')

  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h3" paragraph>
          Reset Password
        </Typography>

        <Typography sx={{ color: "text.secondary", mb: 5 }}>
          Please set your new password.
        </Typography>
      </Stack>

      {/* NewPasswordForm */}

      <NewPasswordForm passwordToken={passwordToken} />

      <Link
        href={"/auth/login"}
        // variant="subtitle2"
        className=" tw-mt-3 tw-mx-auto tw-items-center tw-inline-flex tw-text-inherit text-sm"
       
      >
        <FaCaretLeft size={24} />
        Return to sign in {passwordToken}
      </Link>
    </>
  );
};

export default NewPassword;