

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [openPicker, setOpenPicker] = useState<boolean>(false);
  const idRoom = useSelector((state: RootState) => state.chat.selectedChatId);
  const storedData = JSON.parse(localStorage.getItem("info") || "{}");

  const sendMessage = async (content: string, fileUrl: string | null = null) => {
    if (!content.trim() && !fileUrl) {
      console.warn("Empty message or file cannot be sent.");
      return;
    }

    if (connection) {
      try {
        await connection.invoke("SendMessage", content, fileUrl);
        console.log("Message sent:", content, fileUrl);

        const newMessage: ChatMessage = {
          content,
          sentAt: new Date().toISOString(),
          userId: storedData.id,
          fileUrl: fileUrl || "",
          roomId: idRoom || "",
        };
        dispatch(addMessage(newMessage));
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  const handleFileUpload = async () => {
    if (file && idRoom) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("UserId", storedData.id);

      try {
        const response = await fetch(
          `https://localhost:7001/api/Messages/upload-file/${idRoom}`,
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

        await sendMessage("", fileUrl); // Gửi file URL
        console.log("File uploaded successfully:", fileUrl);

        setFile(null); // Reset trạng thái file
        setPreviewUrl(null);
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        sendMessage(message); // Gửi tin nhắn
        setMessage(""); // Xoá nội dung
      } else if (file) {
        handleFileUpload(); // Upload file
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  if (!idRoom) return <></>;

  return (
    <div className="border-[1px] border-[#f5f5f5] bg-[#FFFFFF] h-[12%] flex flex-row justify-center items-center relative">
      {/* Microphone Icon */}
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
        {/* Emoji picker UI */}
      </Box>

      <IconButton onClick={() => setOpenPicker(!openPicker)}>
        <InsertEmoticonIcon />
      </IconButton>

      {/* Upload Image Button */}
      <label htmlFor="file-upload" style={{ position: "absolute", left: "10%" }}>
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

      {/* Send Button */}
      <SendIcon
        color={message.trim() || file ? "action" : "disabled"}
        sx={{ width: 22, cursor: message.trim() || file ? "pointer" : "not-allowed" }}
        onClick={() => {
          if (message.trim()) {
            sendMessage(message);
            setMessage("");
          } else if (file) {
            handleFileUpload();
          }
        }}
        style={{
          position: "absolute",
          top: "50%",
          left: "95%",
          translate: "-95% -50%",
        }}
      />

      {/* Textarea + Preview */}
      <div className="bg-gray-100 resize-none font-Roboto box-border px-[6%] flex text-md w-[85%] py-[5px] outline-none h-[50%] rounded-3xl">
        <textarea
          spellCheck="false"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent outline-none resize-none"
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="ml-2 w-12 h-12 object-cover rounded-md"
          />
        )}
      </div>
    </div>
  );
}
