import React, { useState, useRef, useEffect } from "react";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { Box, IconButton } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../../redux/store";
import { axiosClient } from "../../libraries/axiosClient";
import { selectChat, updateChat } from "../../redux/Chat/chatSlice";
import { HubConnection } from "@microsoft/signalr";
import { useSignalR } from "../../context/SignalRContext";
import { addMessage } from "../../redux/Chat/chatLatestSlice";


type ChatMessage = {
  userId: string;
  content: string;
  fileUrl: string;
  sentAt: string;
  roomId: string; // Phòng nào
};


interface FileUploadProps {
  userId: string;
  roomId: string;
  sendMessage: (content: string, fileHtml: string) => void;
}

interface MessageInputProps {
  onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Type() {
  const dispatch = useDispatch();
  const { connection } = useSignalR();
  const [openPicker, setOpenPicker] = useState<boolean>(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const roomId = useSelector((state: RootState) => state.chat.selectedChatId);
  const storedData = JSON.parse(localStorage.getItem("info") || "{}");
  const [message, setMessage] = useState<string>(""); // Trạng thái cho message
  const [file, setFile] = useState<File | null>(null);
  const idRoom = useSelector((state: any) => state.chat.selectedChatId);


  const handleEmojiClick = (emoji: { native: string }) => {
    setMessage(prevMessage => prevMessage + emoji.native); // Thêm emoji vào tin nhắn
  };


  
   // Hàm gửi message qua SignalR
   const sendMessage = async (message: string, fileHtml: string | null = null) => {
    if (connection && message.trim()) {
      try {
        await connection.invoke("SendMessage", message, fileHtml);
        console.log("Message sent: ", message, fileHtml);
      } catch (err) {
        console.error("Error sending message: ", err);
      }
    }
  };


  // Xử lý gửi tin nhắn
  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      const newMessage: ChatMessage = {
        content: message,
        sentAt: new Date().toISOString(),
        userId: storedData.id,
        fileUrl: "",
        roomId: roomId || ""
      };
      console.log("new Message: ", newMessage);
      dispatch(addMessage(newMessage))
      console.log("Updated Redux State: ", store.getState().chatLatest);
      setMessage(""); // Xóa nội dung input sau khi gửi
    }
  };


  // UPLOAD FILE
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile); // Get the selected file
  };

  // const handleFileUpload = async () => {
  //   if (file && userId.trim() && roomId) {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("UserId", userId);

  //     try {
  //       const response = await fetch(`https://localhost:7001/api/Messages/upload-file/${roomId}`, {
  //         method: "POST",
  //         body: formData,
  //       });

  //       if (!response.ok) {
  //         console.error("File upload failed");
  //         return;
  //       }

  //       const result = await response.json();
  //       console.log("API Response:", result);

  //       const fileHtml = result.content || 
  //         `<a href="${result.fileUrl}" target="_blank"><img src="${result.fileUrl}" class="post-image" alt="file image"></a>`;

  //       if (!result.content && !result.fileUrl) {
  //         console.error("Invalid API response: No content or fileUrl found.");
  //         return;
  //       }

  //       sendMessage("", fileHtml); // Gửi tin nhắn với nội dung file
  //       console.log(`File uploaded successfully: ${fileHtml}`);
  //     } catch (err) {
  //       console.error("Error uploading file: ", err);
  //     }
  //   } else {
  //     alert("User ID or Room ID is missing, or no file selected.");
  //   }
  // };

  // Api to chat

  // const handleSendMessage = async () => {
  //   if (!messages.trim()) return; // Kiểm tra xem tin nhắn có trống không
  //   setMessages('')
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   };

  //   const data = {
  //     content: messages,
  //     userId: userId,
  //     roomId: roomId,
  //     fileUrl: "string", // Giả sử chưa có file
  //     sentAt: new Date().toISOString(),
  //   };

  //   try {
  //     const response = await axiosClient.post('/api/Messages', data, config);
  //     console.log(response.data.result);
  //     dispatch(updateChat(response.data.result))

  //   ; // Reset lại tin nhắn sau khi gửi
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      //xoá giá trị mặc định của textarea khi nhấn Enter     
      e.preventDefault();
      handleSend();
    }
  };
  if (idRoom === null || idRoom === '') return <></>;
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
      <div style={{ position: "absolute", top: "50%", left: "95%", translate: "-95% -50%", cursor: "pointer" }} onClick={handleSend}>
        <SendIcon color="action" sx={{ width: 22 }} />
      </div>

      {/* Textarea */}
      <textarea
        spellCheck="false"
        data-gramm="false"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown} // Gửi tin nhắn khi nhấn Enter
        className="bg-gray-100 resize-none font-Roboto box-border max-[1024px]:px-8 px-[6%] flex text-md max-[900px]:text-sm w-[95%] py-[10px] outline-none h-[70%] rounded-3xl leading-[43px]"
      />
    </div>
  );
}
