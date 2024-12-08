// redux/Chat/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Room {
  rooms: string;
}

const initialState: Room = {
  rooms: '',
};

const roomSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Action để cập nhật giá trị rooms
    setRooms: (state, action: PayloadAction<string>) => {
      state.rooms = action.payload;
    },
    // Action để cập nhật một phần của giá trị rooms (ví dụ như thêm một phòng mới)
    updateRoom: (state, action: PayloadAction<string>) => {
      state.rooms = action.payload; // hoặc tùy chỉnh logic cập nhật theo cách bạn muốn
    },
  },
});

export const { setRooms, updateRoom } = roomSlice.actions;
export default roomSlice.reducer;
