import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AvatarState {
  imageUrl: string;
}

const initialState: AvatarState = {
  imageUrl: "",
};

const avatarSlice = createSlice({
  name: "avatar",
  initialState,
  reducers: {
    updateUserAvatar: (state, action: PayloadAction<string>) => {
      state.imageUrl = action.payload;
    },
    clearAvatar: (state) => {
      state.imageUrl = initialState.imageUrl;
    },
  },
});

export const { updateUserAvatar, clearAvatar } = avatarSlice.actions;

export default avatarSlice.reducer;
