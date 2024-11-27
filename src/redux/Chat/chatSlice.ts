import { createSlice, PayloadAction } from '@reduxjs/toolkit';


// interface Message {
//   messageId: number;
//   content: string;
//   sentAt: string;
//   isPinned: boolean;
//   fileUrl?: string; // Dữ liệu file nếu có
//   userId: string; // ID của người gửi
//   user: {
//     name: string;
//     imageUrl?: string; // URL ảnh đại diện
//     id: string;
//     userName: string;
//     email: string;
//     [key: string]: any; // Nếu có thêm thuộc tính khác
//   };
//   roomId: number;
//   isRead: boolean;
// }


// Định nghĩa kiểu cho tin nhắn
interface ChatState {
  selectedChatId: string | null; // ID của phòng chat được chọn
  messages: string; // Tin nhắn được lưu dưới dạng chuỗi
}

// Trạng thái ban đầu
const initialState: ChatState = {
  selectedChatId: null, 
  messages: "", // 
};

// Tạo slice cho chat
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Action để lưu ID phòng được chọn
    selectChat(state, action: PayloadAction<string>) {
      state.selectedChatId = action.payload; // Lưu ID vào state
    },
      // Action để cập nhật tin nhắn mới
      updateChat(state, action: PayloadAction<string>) {
        state.messages = action.payload; // Ghi đè chuỗi tin nhắn
      },
      // Action để nối tin nhắn mới vào tin nhắn hiện có
      appendChat(state, action: PayloadAction<string>) {
        state.messages += (state.messages ? "\n" : "") + action.payload; // Nối tin nhắn với dòng mới
      },
  },
});
export const { selectChat } = chatSlice.actions; 
export const { updateChat } = chatSlice.actions;// Export action
export default chatSlice.reducer
