import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import candidatesReducer from './candidatesSlice';
import interviewReducer from './interviewSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['candidates', 'interview']
};

const rootReducer = {
  candidates: persistReducer(persistConfig, candidatesReducer),
  interview: persistReducer(persistConfig, interviewReducer)
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export const persistor = persistStore(store);
