import { createSlice } from "@reduxjs/toolkit";
import { apiConnector } from "@/services/apiConnector";

// import { dispatch } from "../store";

const initialState = {
  sideBar: {
    open: false,
    type: "CONTACT",
  },
  snackbar: {
    open: null,
    severity: null,
    message: null,
  },
  users: [], // all users of app who are not friends and not requested yet
  // all_users: [],
  friends: [], // all friends
  friendRequests: [], // all friend requests
  chat_type: null,
  room_id: null,
  onlineUsers: [],
  // call_logs: [],

  tab: 0,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleSideBar(state) {
      state.sideBar.open = !state.sideBar.open;
    },
    updateSideBarType(state, action) {
      state.sideBar.type = action.payload.type;
    },
    updateTab(state, action) {
      state.tab = action.payload.tab;
    },
    openSnackBar(state, action) {
      console.log(action.payload);
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackBar(state) {
      console.log("This is getting executed");
      state.snackbar.open = false;
      state.snackbar.message = null;
    },
    updateUsers(state, action) {
      state.users = action.payload.users;
    },
    // updateAllUsers(state, action) {
    //   state.all_users = action.payload.users;
    // },
    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },
    updateFriendRequests(state, action) {
      state.friendRequests = action.payload.requests;
    },
    selectConversation(state, action) {
      state.chat_type = "individual";
      state.room_id = action.payload.room_id;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload.onlineUsers;
    },
    userOnline: (state, action) => {
      console.log("In UserOnnline Reducer......")
      state.onlineUsers.push(action.payload.user_id);
    },
    userOffline: (state, action) => {
      console.log("In UserOffline Reducer......");
      return {
        ...state,
        onlineUsers: state.onlineUsers.filter((userId) => userId !== action.payload.user_id),
      };
    },
  },
});

export default appSlice.reducer;

export function ToggleSidebar() {
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.toggleSideBar());
  };
}
export function UpdateSidebarType(type) {
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.updateSideBarType({ type }));
  };
}
export function UpdateTab(tab) {
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.updateTab(tab));
  };
}

export const closeSnackBar = () => async (dispatch, getState) => {
  dispatch(appSlice.actions.closeSnackBar());
};

export const showSnackbar =
  ({ severity, message }) =>
  async (dispatch, getState) => {
    dispatch(
      appSlice.actions.openSnackBar({
        message,
        severity,
      })
    );

    setTimeout(() => {
      dispatch(slice.actions.closeSnackBar());
    }, 4000);
  };

export function FetchUsers() {
  console.log("Fetching Users");
  return async (dispatch, getState) => {
    try {
      console.log("Fetching Users");
      const response = await apiConnector("GET", "/user/get-users", null, {
        Authorization: `Bearer ${getState().auth.token}`,
      });

      console.log(response);
      dispatch(appSlice.actions.updateUsers({ users: response?.data?.data }));
    } catch (error) {
      console.log(error);
    }
  };
}

// export function FetchAllUsers() {
//   return async (dispatch, getState) => {
//     try {
//       const response = await apiConnector('GET', '/user/get-all-verified-users', null, {
//         Authorization: `Bearer ${getState().auth.token}`,
//       });

//       console.log(response);
//       dispatch(slice.actions.updateAllUsers({ users: response.data.data }));
//     } catch (error) {
//       console.log(error);
//     }
//   };
// }

export function FetchFriends() {
  return async (dispatch, getState) => {
    try {
      const response = await apiConnector("GET", "/user/get-friends", null, {
        Authorization: `Bearer ${getState().auth.token}`,
      });

      console.log(response);
      dispatch(
        appSlice.actions.updateFriends({ friends: response?.data?.data })
      );
    } catch (error) {
      console.log(error);
    }
  };
}

export function FetchFriendRequests() {
  return async (dispatch, getState) => {
    try {
      const response = await apiConnector(
        "GET",
        "/user/get-friend-requests",
        null,
        {
          Authorization: `Bearer ${getState().auth.token}`,
        }
      );

      console.log(response);
      dispatch(
        appSlice.actions.updateFriendRequests({
          requests: response?.data?.data,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
}

export const SelectConversation = ({ room_id }) => {
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.selectConversation({ room_id }));
  };
};

export const SetOnlineUsers = ({ onlineUsers }) => {
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.setOnlineUsers({ onlineUsers }));
  };
};

export const UserOnline = ({ user_id }) => {
  console.log("In UserOnnline Thunk......")
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.userOnline({ user_id }));
  };
};

export const UserOffline = ({ user_id }) => {
  console.log("In UserOffline Thunk......")
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.userOffline({ user_id }));
  };
};
