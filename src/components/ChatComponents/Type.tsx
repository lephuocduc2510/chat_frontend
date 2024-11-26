import React, { useState, useRef, useEffect } from "react";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { Box, IconButton } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { axiosClient } from "../../libraries/axiosClient";
import { updateChat } from "../../redux/Chat/chatSlice";

export default function Type() {
  const dispatch = useDispatch();
  const [openPicker, setOpenPicker] = useState<boolean>(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const roomId = useSelector((state: RootState) => state.chat.selectedChatId);
  const storedData = JSON.parse(localStorage.getItem("info") || "{}");
  const [messages, setMessages] = useState<string>('');
  const userId = storedData.id;

  const handleEmojiClick = (emoji: { native: string }) => {
    setMessages(prevMessages => prevMessages + emoji.native); // Thêm emoji vào tin nhắn
  };

  const messagesHandle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessages(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!messages.trim()) return; // Kiểm tra xem tin nhắn có trống không
    setMessages('')
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const data = {
      content: messages,
      userId: userId,
      roomId: roomId,
      fileUrl: "string", // Giả sử chưa có file
      sentAt: new Date().toISOString(),
    };

    try {
      const response = await axiosClient.post('/api/Messages', data, config);
      console.log(response.data.result);
      dispatch(updateChat(response.data.result))

    ; // Reset lại tin nhắn sau khi gửi
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      //xoá giá trị mặc định của textarea khi nhấn Enter     
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-[1px] border-[#f5f5f5] bg-[#FFFFFF] h-[12%] flex flex-row justify-center items-center relative">
      {/* Microphone Icon */}
      <div>
        <MicIcon sx={{ width: 38, cursor: "pointer" }} style={{ position: "absolute", top: "50%", left: "7%", translate: "-4% -50%" }} color="info" />
      </div>

      {/* Emoji Picker */}
      <Box
        style={{
          zIndex: 10,
          left: "47%",
          position: "fixed",
          display: openPicker ? "inline" : "none",
          bottom: 81,
        }}
      >
        {/* <EmojiPicker theme={theme.palette.mode} onEmojiClick={handleEmojiClick} /> */}
      </Box>

      <IconButton onClick={() => setOpenPicker(!openPicker)}>
        <InsertEmoticonIcon />
      </IconButton>

      {/* Send Icon */}
      <div style={{ position: "absolute", top: "50%", left: "95%", translate: "-95% -50%", cursor: "pointer" }} onClick={handleSendMessage}>
        <SendIcon color="action" sx={{ width: 22 }} />
      </div>

      {/* Textarea */}
      <textarea
        spellCheck="false"
        data-gramm="false"
        placeholder="Type a message"
        value={messages}
        onChange={messagesHandle}
        onKeyDown={handleKeyDown} // Gửi tin nhắn khi nhấn Enter
        className="bg-gray-100 resize-none font-Roboto box-border max-[1024px]:px-8 px-[6%] flex text-md max-[900px]:text-sm w-[95%] py-[10px] outline-none h-[70%] rounded-3xl leading-[43px]"
      />
    </div>
  );
}
