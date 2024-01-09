import { createSlice } from "@reduxjs/toolkit";
import { apiConnector } from "@/services/apiConnector";
import { toast } from "react-hot-toast";
import { connectSocket } from "@/socket";
import appSlice from "./appSlice";
// import { showSnackbar } from "./app";

// ----------------------------------------------------------------------

const initialState = {
  isLoggedIn: false,
  token: "",
  isLoading: false,
  user: null,
  user_id: null,
  email: "",
  error: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    logIn(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.user_id = action.payload.user_id;
    },
    signOut(state, action) {
      state.isLoggedIn = false;
      state.token = "";
      state.user_id = null;
    },
    updateRegisterEmail(state, action) {
      state.email = action.payload.email;
    },
  },
});

// Reducer
export default authSlice.reducer;



export function NewPassword(formValues) {
    return async (dispatch, getState) => {
      dispatch(authSlice.actions.updateIsLoading({ isLoading: true, error: false }));
  
      try {
        const response = await apiConnector("POST", "/auth/reset-password", formValues);
  
        console.log(response);
        
        dispatch(
          authSlice.actions.logIn({
            isLoggedIn: true,
            token: response.data.token,
          })
        );

        toast.success(response?.data?.message)
        // dispatch(
        //   showSnackbar({ severity: "success", message: response.data.message })
        // );
        dispatch(
          authSlice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
        // dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(
          authSlice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      }
    };
  }

export function ForgotPassword(formValues) {
    return async (dispatch, getState) => {
      dispatch(authSlice.actions.updateIsLoading({ isLoading: true, error: false }));
  
      try {
        const response = await apiConnector("POST", "/auth/forgot-password", formValues);
        var Res=response;
  
        console.log(response);
  
        // dispatch(
        //   showSnackbar({ severity: "success", message: response.data.message })
        // );
        toast.success(response?.data?.message)
     
        dispatch(
          authSlice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
        // dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(
          authSlice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      }
    };
  }

export function LoginUser(formValues) {
    return async (dispatch, getState) => {
      dispatch(authSlice.actions.updateIsLoading({ isLoading: true, error: false }));
  
      try {
        const response = await apiConnector("POST", "/auth/login", formValues);
        var Res=response;
  
        console.log(response);

        await connectSocket(response?.data?.responseUser?._id);
        console.log('Socket connected in Async Thunk....:');
  
        dispatch(authSlice.actions.logIn({
          isLoggedIn: true,
          token: response.data.token,
          user_id: response.data.responseUser._id,
        }));
  
        window.localStorage.setItem("user_id", response?.data?.responseUser?._id);
        
        toast.success(response?.data?.message)
        // dispatch(showSnackbar({ severity: "success", message: response.data.message }));
        dispatch(authSlice.actions.updateIsLoading({ isLoading: false, error: false }));
      } catch (error) {
        console.log(error);
        
        toast.error(error.message);
        // dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(authSlice.actions.updateIsLoading({ isLoading: false, error: true }));
      }
    };
  }
  

export function LogoutUser() {
  return async (dispatch, getState) => {
    window.localStorage.removeItem("user_id");
    dispatch(authSlice.actions.signOut());
    toast.success("Logged Out !")
  };
}

export function RegisterUser(formValues) {
    return async (dispatch, getState) => {
      dispatch(authSlice.actions.updateIsLoading({ isLoading: true, error: false }));
  
      try {
        const response = await apiConnector("POST", "/auth/register", formValues);
        var Res=response;
  
        console.log(response);
  
         dispatch(authSlice.actions.updateRegisterEmail({ email: formValues.email }));
         toast.success(response?.data?.message)
        // dispatch(showSnackbar({ severity: "success", message: response.data.message }));
        dispatch(authSlice.actions.updateIsLoading({ isLoading: false, error: false }));
  
        if (!getState().auth.error) {
          window.location.href = "/auth/verify-otp";
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
        // dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(authSlice.actions.updateIsLoading({ error: true, isLoading: false }));
      }
    };
 }
  

export function VerifyOTP(formValues) {
    return async (dispatch, getState) => {
      dispatch(authSlice.actions.updateIsLoading({ isLoading: true, error: false }));
  
      try {
        const response = await apiConnector("POST", "/auth/verify-otp", formValues);
        
  
        var Res=response;
        console.log(response);
  
         dispatch(authSlice.actions.updateRegisterEmail({ email: "" }));
        window.localStorage.setItem("user_id", response.data.user_id);
        dispatch(
          authSlice.actions.logIn({
            isLoggedIn: true,
            token: response.data.token,
          })
        );

        toast.success(response?.data?.message);
        // dispatch(
        //   showSnackbar({ severity: "success", message: response.data.message })
        // );
        dispatch(
          authSlice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
        // dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(
          authSlice.actions.updateIsLoading({ error: true, isLoading: false })
        );
      }
    };
  }
  