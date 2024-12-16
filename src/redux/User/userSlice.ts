import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "./type";

interface UserInfoState {
  userInfo: UserInfo;
}

const initialState: UserInfoState = {
  userInfo: {
    id: null,
    fullname: "",
    email: "",
    avatar: "",
    phoneNumber: "",
  },
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = initialState.userInfo;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userInfoSlice.actions;

export default userInfoSlice.reducer;
