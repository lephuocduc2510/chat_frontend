// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./User/userSlice";
import chatReducer from './Chat/chatSlice';
import avatarReducer from './User/avatarSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    avatar: avatarReducer,
    chat: chatReducer,
  },
});

// Định nghĩa kiểu RootState và AppDispatch để hỗ trợ TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
