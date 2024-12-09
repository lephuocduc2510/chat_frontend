import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface ChatState {
  selectedChatId: string | null; 
  nameRoom: string;
  messages: string; 
  isCreatingRoom: boolean; 
  roomDelete: string

}

// Trạng thái ban đầu
const initialState: ChatState = {
  selectedChatId: null, 
  nameRoom: "",
  messages: "", 
  isCreatingRoom: false, 
  roomDelete: ""

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

    //Action để lưu tên phòng
    updateNameRoom(state, action: PayloadAction<string>) {
      state.nameRoom = action.payload; // Lưu tên phòng vào state
    },
   
    // Action để cập nhật tin nhắn mới
    updateChat(state, action: PayloadAction<string>) {
      state.messages = action.payload; // Ghi đè chuỗi tin nhắn
    },
    // Action để nối tin nhắn mới vào tin nhắn hiện có
    appendChat(state, action: PayloadAction<string>) {
      state.messages += (state.messages ? "\n" : "") + action.payload; // Nối tin nhắn với dòng mới
    },

    //Action để lấy ra id phòng vừa xoá
    updateRoomDeleted(state, action: PayloadAction<string>) {
      state.roomDelete = action.payload; // Lưu ID vào state
    },
    // Action để thay đổi trạng thái tạo phòng
    setIsCreatingRoomm(state, action: PayloadAction<boolean>) {
      state.isCreatingRoom = action.payload; // Cập nhật trạng thái
    },
  },
});

// Export actions và reducer
export const { selectChat, updateChat, appendChat, setIsCreatingRoomm, updateNameRoom, updateRoomDeleted } = chatSlice.actions; // Export các action
export default chatSlice.reducer; // Export reducer
