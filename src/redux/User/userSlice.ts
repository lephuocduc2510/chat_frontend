// src/redux/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "./type"

interface UserState {
  userInfo: UserInfo;
}

const initialState: UserState = {
  userInfo: {
    id: null,
    name: "",
    email: "",
    imageUrl: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    updateUserAvatar: (state, action: PayloadAction<string>) => {
      state.userInfo.imageUrl = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = initialState.userInfo;
    },
  },
});

export const { setUserInfo, updateUserAvatar, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
