

import React from "react";
import { Avatar } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { BsPinAngleFill } from "react-icons/bs";

// Định nghĩa kiểu dữ liệu cho props
interface RecieverMessageProps {
  imageUrl?: string;
  content: string;
  index: number; // Vị trí tin nhắn trong mảng messages
  name: string; // Tên người nhận tin nhắn
  time: string; // Thời gian tin nhắn
  isPinned: boolean; // Kiểm tra tin nhắn đã được ghim hay chưa
  fileUrl?: string; // URL file đính kèm (nếu có)
}

export default function RecieverMessage({
  imageUrl,
  content,
  index,
  name,
  time,
  isPinned,
  fileUrl
}: RecieverMessageProps) {
  const messageTime = new Date(time);

  return (
    <div className="max-w-[60%]">
      <div className="flex flex-row items-start my-2 gap-3">
        {/* Avatar với tooltip */}
        <Tooltip title={name} arrow placement="top-start">
          <Avatar
            alt="User-pic"
            src={imageUrl || "https://via.placeholder.com/150"} // Nếu không có ảnh, sử dụng placeholder
            style={{
              width: '40px', // Kích thước avatar nhỏ hơn
              height: '40px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Hiệu ứng bóng
            }}
          />
        </Tooltip>

        {/* Nội dung tin nhắn */}
        <div className="flex flex-col max-w-[85%] relative">
          {/* Tên người nhắn */}
          <p className="text-sm text-gray-800 font-medium mb-1">
            {name}
          </p>

          {/* Tin nhắn */}
          <div className="bg-[#0284C7] pe-8 relative rounded-tl-lg rounded-tr-lg rounded-bl-lg font-Roboto rounded-br-lg text-white px-3 py-1 shadow-md flex flex-col gap-1">
            {/* Nội dung tin nhắn */}
            <p className="w-full min-w-[50px] mt-1" style={{ wordWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: content }} />

            {/* Hiển thị file nếu có */}
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

            {/* Thời gian tin nhắn */}
            <p className="text-[10px] text-right text-gray-200 font-light">
              {`${String(messageTime.getHours() % 12 || 12).padStart(2, '0')}:${String(messageTime.getMinutes()).padStart(2, '0')} ${messageTime.getHours() >= 12 ? 'PM' : 'AM'}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
