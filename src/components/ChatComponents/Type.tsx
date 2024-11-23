import React, { useRef } from "react";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { Box, IconButton } from "@mui/material";
import useTheme from "@mui/system/useTheme";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";





export default function Type() {
  const [openPicker, setOpenPicker] = React.useState<boolean>(false);
  const theme = useTheme();
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  function handleEmojiClick(emoji: { native: string }) {
    // Handle emoji selection
  }

  return (
    <div
      className="border-[1px] border-[#f5f5f5] bg-[#FFFFFF] h-[12%] flex flex-row justify-center items-center relative"
      ref={emojiPickerRef}
    >
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
        ></MicIcon>
      </div>

      <Box
        style={{
          zIndex: 10,
          left: "47%",
          position: "fixed",
          display: openPicker ? "inline" : "none",
          bottom: 81,
        }}
      >
         {/* <EmojiPicker
        theme={theme.palette.mode} // Sử dụng theme nếu cần
        onEmojiClick={handleEmojiClick}
      /> */}
      </Box>

      <IconButton
        onClick={() => {
          setOpenPicker(!openPicker);
        }}
      >
        <InsertEmoticonIcon />
      </IconButton>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "95%",
          translate: "-95% -50%",
          cursor: "pointer",
        }}
      >
        <SendIcon color="action" sx={{ width: 22 }}></SendIcon>
      </div>

      <textarea
        spellCheck="false"
        data-gramm="false"
        placeholder="Type a message"
        className="bg-gray-100 resize-none font-Roboto box-border max-[1024px]:px-8 px-[6%] flex text-md max-[900px]:text-sm w-[95%] py-[1%] outline-none h-[70%] rounded-3xl"
      ></textarea>
    </div>
  );
}
