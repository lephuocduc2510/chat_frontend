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



interface Message {
  messageId: number;      // ID của tin nhắn
  content: string;        // Nội dung tin nhắn
  sentAt: string;         // Thời gian gửi
  isPinned: boolean;      // Cờ ghim tin nhắn
  fileUrl?: string;       // URL file (nếu có)
  userId: string | null;  // ID của người dùng (có thể là null)
  user?: {                // Thông tin người dùng (có thể là undefined hoặc null)
    name: string;
    imageUrl?: string;
    id: string;
    userName: string;
    email: string;
    [key: string]: any;   // Nếu có thêm thuộc tính khác
  } | null;
  roomId: number | null;  // ID phòng chat (có thể là null)
  room?: any;             // Thông tin phòng (nếu có, tùy chọn)
  isRead: boolean;        // Cờ đọc tin nhắn
}

interface ChatState {
  selectedChatId: string | null;
  messages: Message[];
}


const initialState: ChatState = {
  selectedChatId: null, // Mặc định không có phòng nào được chọn
  messages: [], // Mặc định không có tin nhắn
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Action để lưu ID phòng được chọn
    selectChat(state, action: PayloadAction<string>) {
      state.selectedChatId = action.payload; // Lưu ID vào state
    },
    // Action để cập nhật đoạn chat mới
    updateChat(state, action: PayloadAction<Message>) {
      // Thêm tin nhắn mới vào danh sách tin nhắn
      state.messages.push(action.payload);
    },
  },
});

export const { selectChat } = chatSlice.actions; 
export const { updateChat } = chatSlice.actions;// Export action
export default chatSlice.reducer
