import React from "react";
import { BsPinAngleFill } from "react-icons/bs";

// Định nghĩa kiểu dữ liệu cho props
interface SenderMessageProps {
  time: string; // Thời gian tin nhắn dưới dạng chuỗi
  content: string; // Nội dung tin nhắn
  isPinned: boolean; // Kiểm tra tin nhắn đã được ghim hay chưa
}

export default function SenderMessage({ time, content, isPinned }: SenderMessageProps) {
  const messageTime = new Date(time);

  return (
    <div className="max-w-[60%] ml-auto h-auto">
      <div className="flex flex-row relative justify-end my-1 max-w-[100%] h-auto">
        <div className="bg-[#014DFE] max-w-[100%] relative rounded-tl-lg rounded-tr-lg rounded-bl-lg font-Roboto rounded-br-lg text-white box-border px-2 pt-2 pb-2 flex flex-col items-end max-[900px]:text-sm flex justify-between">
          <p
            className="w-[100%] min-w-[50px] pe-5 pb-2"
            style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }} // Cải thiện wrap
          >
            {content}
          </p>
          {/* Biểu tượng ghim */}
          {isPinned && (
            <BsPinAngleFill className="absolute top-2 right-2 text-yellow-400" size={16} />
          )}
          <p className="absolute bottom-[3px] right-2 text-[9px] pl-2 flex items-end font-medium">
            {`${String(messageTime.getHours() % 12 || 12).padStart(2, '0')}:${String(
              messageTime.getMinutes()
            ).padStart(2, '0')} ${messageTime.getHours() >= 12 ? "pm" : "am"}`}
          </p>
        </div>
      </div>
    </div>
  );
}
