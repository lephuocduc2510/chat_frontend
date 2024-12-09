import React, { useState, useRef } from "react";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { Box, IconButton } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import PhotoIcon from "@mui/icons-material/Photo";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../redux/Chat/chatLatestSlice";
import { useSignalR } from "../../context/SignalRContext";
import { RootState } from "../../redux/store";

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
  const [openPicker, setOpenPicker] = useState<boolean>(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const roomId = useSelector((state: RootState) => state.chat.selectedChatId);
  const storedData = JSON.parse(localStorage.getItem("info") || "{}");
  const [message, setMessage] = useState<string>(""); // Message content
  const [file, setFile] = useState<File | null>(null); // File for upload
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Preview URL for image

  const handleEmojiClick = (emoji: { native: string }) => {
    setMessage((prevMessage) => prevMessage + emoji.native);
  };

  // Send message via SignalR
  const sendMessage = async (message: string, fileHtml: string | null = null) => {
    if (connection && (message.trim() || fileHtml)) {
      try {
        await connection.invoke("SendMessage", message, fileHtml);
        console.log("Message sent: ", message, fileHtml);
      } catch (err) { 
        console.error("Error sending message: ", err);
      }
    }
  };

  // Handle message send
  const handleSend = () => {
    if (!message.trim() && !file) {
      alert("Please enter a message or upload an image.");
      return;
    }

    if (message.trim()) {
      sendMessage(message);
    }

    const newMessage: ChatMessage = {
      content: message,
      sentAt: new Date().toISOString(),
      userId: storedData.id,
      fileUrl: previewUrl || "",
      roomId: roomId || "",
    };

    dispatch(addMessage(newMessage));
    setMessage(""); // Reset input
    setFile(null); // Reset file
    setPreviewUrl(null); // Reset preview
  };

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);

    // Generate preview URL
    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
    }
  };

  // Handle Enter key for sending
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (roomId === null) return <></>;

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
        {/* Emoji picker */}
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
