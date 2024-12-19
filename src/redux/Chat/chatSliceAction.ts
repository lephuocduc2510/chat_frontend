import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  _id: string; // Lưu ID của tin nhắn
  content: string; // Lưu nội dung của tin nhắn
  roomId?: string; // Lưu ID của phòng
}

const initialState: ChatState = {
  _id: '', // Khởi tạo ID tin nhắn rỗng
  content: '', // Khởi tạo nội dung tin nhắn rỗng

};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Action để cập nhật cả _id, content và roomId
    updateChat(state, action: PayloadAction<{ _id: string; content: string; roomId: number }>) {
      state._id = action.payload._id; // Lưu ID tin nhắn
      state.content = action.payload.content; // Lưu nội dung tin nhắn
    
    },
  },
});

export const { updateChat } = chatSlice.actions;

export default chatSlice.reducer;
