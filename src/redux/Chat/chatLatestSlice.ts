import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ChatMessage = {
  userId: string;
  content: string;
  fileUrl: string;
  sentAt: string;
  roomId: string; // Phòng nào
  avatar: string;
  nameUser: string;
};

interface ChatLatestState {
    [roomId: string]: ChatMessage; // Mỗi phòng lưu tin nhắn cuối cùng
  }



const initialState: ChatLatestState = {};

const chatLatestSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Thêm một tin nhắn mới
    addMessage(state, action: PayloadAction<ChatMessage>) {
        const { roomId } = action.payload;
        state[roomId] = action.payload; // Cập nhật tin nhắn mới nhất cho phòng
      },
    
  },    
});

// Xuất các actions
export const { addMessage } = chatLatestSlice.actions;

// Xuất reducer
export default chatLatestSlice.reducer;
