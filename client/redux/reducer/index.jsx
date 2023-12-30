import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import appSlice from '../slices/appSlice';
import authSlice from '../slices/authSlice';
import conversationSlice from '../slices/conversationSlice';

// slices

// import audioCallReducer from './slices/audioCall';
// import videoCallReducer from './slices/videoCall';
// import authReducer from './slices/auth';
// import conversationReducer from './slices/conversation';
const rootPersistConfig = {
    key: 'root',
    storage,
    keyPrefix: 'redux-',
    //   whitelist: [],
    //   blacklist: [],
  };

  const rootReducer = combineReducers({
    app: appSlice,
    auth:authSlice,
    conversation:conversationSlice
    // auth: authReducer,
    // conversation: conversationReducer,
    // audioCall: audioCallReducer,
    // videoCall: videoCallReducer,
  });
  
  export { rootPersistConfig, rootReducer }
  