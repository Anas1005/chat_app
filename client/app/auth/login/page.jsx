
// sections
'use client'
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/sections/Auth/LoginForm";
import AuthSocial from "@/sections/Auth/AuthSocial";

// ----------------------------------------------------------------------

const LoginPage=()=> {
    const router=useRouter();
    

    return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4">Login to Tawk</Typography>

        <Stack direction="row" spacing={0.5} sx={{alignItems:"center", columnGap:"4"}}>
          <Typography variant="body2">New user?</Typography>

           <Link href="/auth/register"
            className=" tw-underline tw-cursor-pointer tw-text-emerald-400 "
          >
           Create an Account
          </Link>
         

        </Stack>
      </Stack>
      {/* Form */}
      <LoginForm />

      <AuthSocial />
    </>
  );
}

export default LoginPage;