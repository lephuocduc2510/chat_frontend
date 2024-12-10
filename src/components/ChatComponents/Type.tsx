import React, { useState } from "react";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { IconButton, Box } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import PhotoIcon from "@mui/icons-material/Photo";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addMessage } from "../../redux/Chat/chatLatestSlice";
import { useSignalR } from "../../context/SignalRContext";

type ChatMessage = {
  userId: string;
  content: string;
  fileUrl: string;
  sentAt: string;
  roomId: string;
};

export default function Type() {
  const dispatch = useDispatch();
  const { connection } = useSignalR();
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // for image preview
  const [openPicker, setOpenPicker] = useState<boolean>(false); // for emoji picker toggle
  const idRoom = useSelector((state: RootState) => state.chat.selectedChatId);
  const storedData = JSON.parse(localStorage.getItem("info") || "{}");

  // Gửi tin nhắn hoặc file qua SignalR
  const sendMessage = async (content: string, fileUrl: string | null = null) => {
    if (connection && (content.trim() || fileUrl)) {
      try {

        await connection.invoke("SendMessage", content, fileUrl);
        console.log("Message sent:", content, fileUrl);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      // Gửi tin nhắn văn bản
      const newMessage: ChatMessage = {
        content: message,
        sentAt: new Date().toISOString(),
        userId: storedData.id,
        fileUrl: "",
        roomId: idRoom || "",
      };
      dispatch(addMessage(newMessage));
      sendMessage(message);
      setMessage("");
    } else if (file) {
      // Chỉ upload file nếu không có tin nhắn văn bản
      handleFileUpload();
    }
  };

  // Upload file
  const handleFileUpload = async () => {
    if (file && idRoom) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("UserId", storedData.id);

      try {
        const response = await fetch(`https://localhost:7001/api/Messages/upload-file/${idRoom}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("File upload failed");
        }

        const result = await response.json();
        const fileUrl = result.fileUrl;
        sendMessage("", fileUrl);

        const newMessage: ChatMessage = {
          content: "",
          sentAt: new Date().toISOString(),
          userId: storedData.id,
          fileUrl,
          roomId: idRoom || "",
        };

        dispatch(addMessage(newMessage));
        console.log("File uploaded successfully:", fileUrl);
        setFile(null);
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }
  };

  // Xử lý thay đổi file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // Preview the selected image
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (idRoom === null || idRoom === '') return <></>;

  return (
    <div className="border-[1px] border-[#f5f5f5] bg-[#FFFFFF] h-[12%] flex flex-row justify-center items-center relative">
      {/* Microphone Icon */}
      <div>
        <MicIcon
          sx={{ width: 38, cursor: "pointer" }}
          style={{
            position: "absolute",
            top: "50%",
            left: "7%",
            translate: "-4% -50%",
          }}
          color="info"
        />
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
        {/* Emoji picker UI here */}
      </Box>

      <IconButton onClick={() => setOpenPicker(!openPicker)}>
        <InsertEmoticonIcon />
      </IconButton>

      {/* Upload Image Button */}
      <div style={{ position: "absolute", left: "10%" }}>
        <label htmlFor="file-upload">
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <IconButton component="span">
            <PhotoIcon color="action" fontSize="medium" />
          </IconButton>
        </label>
      </div>

      {/* Send Icon */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "95%",
          translate: "-95% -50%",
          cursor: "pointer",
        }}
        onClick={handleSend}
      >
        <SendIcon color="action" sx={{ width: 22 }} />
      </div>

      {/* Textarea + Preview */}
      <div className="bg-gray-100 resize-none font-Roboto box-border max-[1024px]:px-8 px-[6%] flex text-md max-[900px]:text-sm w-[85%] py-[5px] outline-none h-[50%] rounded-3xl leading-[30px]">
        <textarea
          spellCheck="false"
          data-gramm="false"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent outline-none resize-none"
          style={{ height: "100%" }}
        />
        {previewUrl && (
          <div className="ml-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-12 h-12 object-cover rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}