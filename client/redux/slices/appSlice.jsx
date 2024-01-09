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
  notification: {
    notifications: [],
    unreadCount: 0,
  },
  chat_type: null,
  room_id: null,
  onlineUsers: [],
  typingUsers: [],
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
    setNotifications(state, action) {
      console.log("In Reducer", action.payload.notifications);
      state.notification.notifications = action.payload.notifications;
      state.notification.unreadCount = action.payload.notifications.filter(
        (notification) => !notification.read
      ).length;
    },

    markNotificationAsRead(state, action) {
      const notificationId = action.payload.notificationId;

      // Find the index of the notification in the state by its ID
      const notificationIndex = state.notification.notifications.findIndex(
        (n) => n._id === notificationId
      );

      if (notificationIndex !== -1) {
        // Create a new array with the updated notification
        const updatedNotifications = [...state.notification.notifications];
        updatedNotifications[notificationIndex] = {
          ...updatedNotifications[notificationIndex],
          read: true,
        };

        // Update the state with the new array and decrement the unread count
        state.notification.notifications = updatedNotifications;
        state.notification.unreadCount -= 1;
      }
    },

    removeNotification(state, action) {
      const notificationId = action.payload.notificationId;

      const removedNotification = state.notification.notifications.find(
        (n) => n._id === notificationId
      );

      // Filter out the notification with the specified ID
      state.notification.notifications =
        state.notification.notifications.filter(
          (n) => n._id !== notificationId
        );

      // If the removed notification was unread, decrement the unread count

      console.log("Read", removedNotification);
      if (removedNotification && !removedNotification.read) {
        state.notification.unreadCount -= 1;
      }
    },

    selectConversation(state, action) {
      state.chat_type = "individual";
      state.room_id = action.payload.room_id;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload.onlineUsers;
    },
    userOnline: (state, action) => {
      console.log("In UserOnnline Reducer......");
      state.onlineUsers.push(action.payload.user_id);
    },
    userOffline: (state, action) => {
      console.log("In UserOffline Reducer......");
      return {
        ...state,
        onlineUsers: state.onlineUsers.filter(
          (userId) => userId !== action.payload.user_id
        ),
      };
    },

    setTypingUsers: (state, action) => {
      const user_id = action.payload.user_id;

      // Check if the user_id is already present in typingUsers
      const isUserTyping = state.typingUsers.includes(user_id);

      if (isUserTyping) {
        // If user_id is already present, remove it
        state.typingUsers = state.typingUsers.filter((id) => id !== user_id);
      } else {
        // If user_id is not present, add it
        state.typingUsers.push(user_id);
      }
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

export function SetNotifications({ notifications }) {
  console.log("In Thunk", notifications);
  return async (dispatch, getState) => {
    dispatch(
      appSlice.actions.setNotifications({
        notifications,
      })
    );
  };
}
export function MarkNotificationAsRead({ notificationId }) {
  return async (dispatch, getState) => {
    try {
      // Make the API call to mark the notification as read with notificationId in the request body
      dispatch(appSlice.actions.markNotificationAsRead({ notificationId }));
      const response = await apiConnector(
        "POST",
        "/user/mark-notification-as-read",
        { notificationId },
        {
          Authorization: `Bearer ${getState().auth.token}`,
        }
      );

      // Dispatch the action to update the state
    } catch (error) {
      // Handle the error, maybe dispatch an error action or log it
      console.error("Error marking notification as read:", error.message);
    }
  };
}

export function RemoveNotification({ notificationId }) {
  return async (dispatch, getState) => {
    try {
      // Make the API call to remove the notification with notificationId in the request body
      dispatch(appSlice.actions.removeNotification({ notificationId }));
      await apiConnector(
        "POST",
        "/user/remove-notification",
        { notificationId },
        {
          Authorization: `Bearer ${getState().auth.token}`,
        }
      );

      // Dispatch the action to update the state
    } catch (error) {
      // Handle the error, maybe dispatch an error action or log it
      console.error("Error removing notification:", error.message);
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
  console.log("In UserOnnline Thunk......");
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.userOnline({ user_id }));
  };
};

export const UserOffline = ({ user_id }) => {
  console.log("In UserOffline Thunk......");
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.userOffline({ user_id }));
  };
};

export const SetTypingUsers = ({ user_id }) => {
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.setTypingUsers({ user_id }));
  };
};

// export const UpdateTypingUsers = ({ user_id }) => {
//   console.log("In UserOnnline Thunk......");
//   return async (dispatch, getState) => {
//     dispatch(appSlice.actions.updateTypingUsers({ user_id }));
//   };
// };
