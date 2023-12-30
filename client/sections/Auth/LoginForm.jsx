'use client'
import { useState } from "react";
import * as Yup from "yup";
// import { Link as RouterLink } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Stack, Alert, IconButton, InputAdornment } from "@mui/material";
import { LoginUser } from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";

import { FormProvider, RHFTextField } from "@/components/hook-form";

// import { Eye, EyeSlash } from "phosphor-react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { LoginUser } from "../../redux/slices/auth";
// import { useDispatch, useSelector } from "react-redux";

// ----------------------------------------------------------------------

const LoginForm=()=> {
   const dispatch = useDispatch();
//   const router=useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {isLoading} = useSelector((state) => state.auth);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    email: "demo@tawk.com",
    password: "demo1234",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      console.log(data);
      // submit data to backend
      dispatch(LoginUser(data));
    } catch (error) {
      console.error(error);
      reset();
      setError("afterSubmit", {
        ...error,
        message: error.message,
      });
    }
  };

  return (
    <FormProvider
     onSubmit={handleSubmit(onSubmit)}
     methods={methods}
     >
      <Stack spacing={3} >
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack alignItems="flex-end" sx={{ my: 2 }}>
      <Link href="/auth/reset-password"
            className=" tw-underline tw-cursor-pointer tw-text-black "
          >
           Forgot Password ?
          </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isLoading}
        sx={{
          bgcolor: "text.primary",
          color: (theme) =>
            theme.palette.mode === "light" ? "common.white" : "grey.800",
          "&:hover": {
            bgcolor: "text.primary",
            color: (theme) =>
              theme.palette.mode === "light" ? "common.white" : "grey.800",
          },
        }}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}

export default LoginForm;