
import React, { useState } from "react";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { IconButton, CircularProgress } from "@mui/material";
import PhotoIcon from "@mui/icons-material/Photo";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addMessage } from "../../redux/Chat/chatLatestSlice";
import { useSocket } from "../../context/SocketContext";
import { Email } from "@mui/icons-material";

type ChatMessage = {
  userId: string;
  content: string;
  fileUrl: string;
  sentAt: string;
  roomId: string;
  avatar: string;
};

export default function Type() {
  const dispatch = useDispatch();
  const  socket = useSocket();
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const idRoom = useSelector((state: RootState) => state.chat.selectedChatId) || "";
  const storedData = JSON.parse(localStorage.getItem("info") || "{}");

  const sendMessage = async (content: string, fileUrl: string | null = null) => {
    if (!content.trim() && !fileUrl) {
      console.warn("Empty message or file cannot be sent.");
      return;
    }

    if (socket) {
      socket.emit('client-message', {
        type: 'chat',
        roomId: idRoom,
        idUser: storedData.id,
        nameUser: storedData.fullname,
        avatar: storedData.avatar,
        message: content,
        timestamp: new Date().toLocaleTimeString(),

      });
      console.log("Message sent:", content, idRoom);
    }
  
    const messageData: ChatMessage = {
      userId: storedData.id,
      content,
      fileUrl: fileUrl || "",
      sentAt: new Date().toISOString(),
      roomId: idRoom,
      avatar: storedData.avatar,
    };
    dispatch(addMessage(messageData)); // Add message to chat list



 
  };

  const handleFileUpload = async () => {
    if (file && idRoom) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("UserId", storedData.id);

      setIsLoading(true); // Start loading
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

        await sendMessage("", fileUrl); // Send file URL
        console.log("File uploaded successfully:", fileUrl);

        setFile(null); // Reset file state
        setPreviewUrl(null);
      } catch (err) {
        console.error("Error uploading file:", err);
      } finally {
        setIsLoading(false); // Stop loading
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        sendMessage(message); // Send message
        setMessage(""); // Clear input
      } else if (file) {
        handleFileUpload(); // Upload file
      }
    }
  };

  const removePreview = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  if (!idRoom) return <></>;

  return (
    <div className="border-[1px] border-[#f5f5f5] bg-[#FFFFFF] h-[12%] flex flex-row justify-center items-center relative">
      {/* Display image preview */}
      {previewUrl && (
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "10px",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={previewUrl}
            alt="Preview"
            className="w-16 h-16 object-cover rounded-md shadow-md"
          />
          <IconButton
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              backgroundColor: "white",
              border: "1px solid #ccc",
            }}
            size="small"
            onClick={removePreview}
          >
            <CloseIcon fontSize="small" color="error" />
          </IconButton>
        </div>
      )}

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

      {/* Upload Image Button */}
      <label htmlFor="file-upload" style={{ position: "absolute", left: "1%" }}>
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
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "95%",
          transform: "translate(-95%, -50%)",
        }}
      >
        {isLoading ? (
          <CircularProgress size={20} />
        ) : (
          <SendIcon
            color={message.trim() || file ? "action" : "disabled"}
            sx={{
              width: 22,
              cursor: message.trim() || file ? "pointer" : "not-allowed",
            }}
            onClick={() => {
              if (message.trim()) {
                sendMessage(message);
                setMessage("");
              } else if (file) {
                handleFileUpload();
              }
            }}
          />
        )}
      </div>

      {/* Textarea */}
      <div className="bg-gray-100 resize-none font-Roboto box-border px-[6%] flex text-md w-[85%] py-[5px] outline-none h-[50%] rounded-3xl">
        <textarea
          spellCheck="false"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent outline-none resize-none"
        />
      </div>
    </div>
  );
}
