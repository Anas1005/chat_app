'use client'
import React from 'react';
// @mui
import { Stack, Typography, Link } from '@mui/material';
import { useRouter } from "next/navigation";
import RegisterForm from '@/sections/Auth/RegisterForm';
import AuthSocial from '@/sections/Auth/AuthSocial';

// ----------------------------------------------------------------------

const Register=()=> {
    const router=useRouter();
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Get started with Tawk.</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2"> Already have an account? </Typography>

          <div
          className="
            flex
            gap-2
            justify-center
            text-sm
            mt-6
            px-2
            text-gray-500
          "
        >
           <div
            onClick={()=>router.push("/auth/login")} 
            className=" tw-underline tw-cursor-pointer"
          >
           Sign In
          </div>
          </div>
        </Stack>
      </Stack>
      {/* Form */}
      <RegisterForm  />

      <Typography
        component="div"
        sx={{ color: 'text.secondary', mt: 3, typography: 'caption', textAlign: 'center' }}
      >
        {'By signing up, I agree to '}
        <Link underline="always" color="text.primary">
          Terms of Service
        </Link>
        {' and '}
        <Link underline="always" color="text.primary">
          Privacy Policy
        </Link>
        .
      </Typography>

     <AuthSocial />
      </>
  );
}

export default Register;