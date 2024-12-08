// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./User/userSlice";
import chatReducer from './Chat/chatSlice';
import avatarReducer from './User/avatarSlice';
import chatLatest from './Chat/chatLatestSlice';
import roomReducer  from './Chat/roomSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    avatar: avatarReducer,
    chat: chatReducer,
    chatLatest: chatLatest,
    rooms: roomReducer,
  },
});

// Định nghĩa kiểu RootState và AppDispatch để hỗ trợ TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
