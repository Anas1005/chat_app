
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch,useSelector } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import { rootPersistConfig, rootReducer } from './reducer';


 const store = configureStore({
    reducer: persistReducer(rootPersistConfig, rootReducer),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
  });

  const persistor = persistStore(store);
  const { dispatch } = store;

  export { store, persistor, dispatch, useSelector, useDispatch };