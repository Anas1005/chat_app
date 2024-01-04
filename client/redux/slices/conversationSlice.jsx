import { createSlice } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";
// import { AWS_S3_REGION, S3_BUCKET_NAME } from "../../config";

// const user_id = window.localStorage.getItem("user_id");

const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  group_chat: {},
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setDirectConversations(state, action) {
      const conversationList = action.payload.conversationList;
      const user_id = action.payload.user_id;

      const conversations = conversationList.map((el) => {
        const user = el.participants.find(
          (elm) => elm._id.toString() !== user_id
        );
        return {
          id: el._id,
          user_id: user?._id,
          name: `${user?.firstName} ${user?.lastName}`,
          online: user?.status === "Online",
          //   img: `https://${S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${user?.avatar}`,
          img: faker.image.avatar(),
          msg: el.messages.slice(-1)[0]?.text,
          time: new Date(el.messages.slice(-1)[0]?.createdAt),
          unread: el.messages.filter(
            (message) => message.status !== "Seen" && message.to === user_id
          ).length,
          pinned: false,
          outgoing: el.messages.slice(-1)[0]?.from === user_id,
          status: el.messages.slice(-1)[0]?.status,
          //   about: user?.about,
        };
      });
      console.log("Before");
      state.direct_chat.conversations = conversations;
      console.log("After");
    },

    updateDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      const user_id = action.payload.user_id;

      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (el) => {
          if (el?.id !== this_conversation._id) {
            return el;
          } else {
            const user = this_conversation.participants.find(
              (elm) => elm._id.toString() !== user_id
            );
            return {
              id: this_conversation._id,
              user_id: user?._id,
              name: `${user?.firstName} ${user?.lastName}`,
              online: user?.status === "Online",
              img: faker.image.avatar(),
              msg: this_conversation.messages.slice(-1)[0]?.text,
              time: new Date(
                this_conversation.messages.slice(-1)[0]?.createdAt
              ),
              outgoing:
                this_conversation.messages.slice(-1)[0]?.from === user_id,
              status: this_conversation.messages.slice(-1)[0]?.status,
              unread: this_conversation.messages.filter(
                (message) => message.status !== "Seen" && message.to === user_id
              ).length,
              pinned: false,
            };
          }
        }
      );
    },

    resetUnreadCountOfDC(state, action) {
      const this_conversation_id = action.payload.conversationId;
      // const user_id=action.payload.user_id;
      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (el) => {
          if (el?.id !== this_conversation_id) {
            return el;
          } else {
            return { ...el, unread: 0 };
          }
        }
      );
    },

    addDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      const user_id = action.payload.user_id;

      const user = this_conversation.participants.find(
        (elm) => elm._id.toString() !== user_id
      );
      state.direct_chat.conversations = state.direct_chat.conversations.filter(
        (el) => el?.id !== this_conversation._id
      );
      state.direct_chat.conversations.push({
        id: this_conversation._id,
        user_id: user?._id,
        name: `${user?.firstName} ${user?.lastName}`,
        online: user?.status === "Online",
        img: faker.image.avatar(),
        msg: this_conversation.messages.slice(-1)[0]?.text,
        time: new Date(this_conversation.messages.slice(-1)[0]?.createdAt),
        outgoing: this_conversation.messages.slice(-1)[0]?.from === user_id,
        status: this_conversation.messages.slice(-1)[0]?.status,
        unread: this_conversation.messages.filter(
          (message) => message.status !== "Seen" && message.to === user_id
        ).length,
        pinned: false,
      });
    },

    setCurrentConversation(state, action) {
      state.direct_chat.current_conversation = action.payload;
    },

    setCurrentMessages(state, action) {
      const messages = action.payload.messages;
      const user_id = action.payload.user_id;
      const formatted_messages = messages.map((el) => ({
        // id: el._id,
        type: "msg",
        subtype: el.subtype,
        text: el.text,
        createdAt: el.createdAt,
        incoming: el.to === user_id,
        outgoing: el.from === user_id,
        status: el.status,
      }));
      state.direct_chat.current_messages = formatted_messages;
    },

    addDirectMessage(state, action) {
      state.direct_chat.current_messages.push(action.payload.message);
    },
  },
});

// Reducer
export default conversationSlice.reducer;

// ----------------------------------------------------------------------

export const SetDirectConversations = ({ conversationList, user_id }) => {
  return async (dispatch, getState) => {
    dispatch(
      conversationSlice.actions.setDirectConversations({
        conversationList,
        user_id,
      })
    );
  };
};

export const AddDirectConversation = ({ conversation, user_id }) => {
  return async (dispatch, getState) => {
    dispatch(
      conversationSlice.actions.addDirectConversation({ conversation, user_id })
    );
  };
};
export const UpdateDirectConversation = ({ conversation, user_id }) => {
  return async (dispatch, getState) => {
    dispatch(
      conversationSlice.actions.updateDirectConversation({
        conversation,
        user_id,
      })
    );
  };
};
export const ResetUnreadCountOfDC = ({ conversationId }) => {
  return async (dispatch, getState) => {
    dispatch(
      conversationSlice.actions.resetUnreadCountOfDC({
        conversationId,
      })
    );
  };
};

export const SetCurrentConversation = (current_conversation) => {
  return async (dispatch, getState) => {
    dispatch(
      conversationSlice.actions.setCurrentConversation(current_conversation)
    );
  };
};

export const SetCurrentMessages = ({ messages, user_id }) => {
  return async (dispatch, getState) => {
    dispatch(
      conversationSlice.actions.setCurrentMessages({ messages, user_id })
    );
  };
};

export const AddDirectMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(conversationSlice.actions.addDirectMessage({ message }));
  };
};
