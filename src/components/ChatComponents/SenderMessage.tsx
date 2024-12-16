
import React from "react";
import { BsPinAngleFill } from "react-icons/bs";

// Định nghĩa kiểu dữ liệu cho props
interface SenderMessageProps {
  time: string; // Thời gian tin nhắn dưới dạng chuỗi
  content: string; // Nội dung tin nhắn
  isPinned: boolean; // Kiểm tra tin nhắn đã được ghim hay chưa
  fileUrl?: string; // URL file đính kèm (nếu có)
}

export default function SenderMessage({ time, content, isPinned, fileUrl }: SenderMessageProps) {
  const messageTime = time ? time : "";

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Chuyển đổi giờ 24h sang 12h
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };


  return (
    <div className="max-w-[60%] ml-auto h-auto">
      <div className="flex flex-row relative justify-end my-1 max-w-[100%] h-auto">
        <div className="bg-[#014DFE] max-w-[100%] relative rounded-tl-lg rounded-tr-lg rounded-bl-lg font-Roboto rounded-br-lg text-white box-border px-2 pt-2 pb-2 flex flex-col items-end max-[900px]:text-sm flex justify-between">
          <p
            className="w-[100%] min-w-[50px] pb-2"
            style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: content }} // Render HTML content
          />
          {/* Kiểm tra và hiển thị file nếu có */}
          {fileUrl && (
            <div>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                [File]
              </a>
            </div>
          )}

          {/* Biểu tượng ghim */}
          {isPinned && (
            <BsPinAngleFill className="absolute top-2 right-2 text-yellow-400" size={16} />
          )}

            <p className="absolute bottom-[3px] right-2 text-[9px] pl-2 flex items-end font-medium">
              {formatTime(messageTime)}
            </p>
        </div>
      </div>
    </div>
  );
}
