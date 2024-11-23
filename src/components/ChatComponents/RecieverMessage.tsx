import React from "react";
import { Avatar } from "@mui/material";
import { isSameUser } from "../../helper/Reusable";
import Tooltip from "@mui/material/Tooltip";

// Định nghĩa kiểu dữ liệu cho props
interface RecieverMessageProps {
  img: string; // Đường dẫn hình ảnh người nhận
  content: string; // Nội dung tin nhắn
  messages: any[]; // Mảng tin nhắn (có thể tùy chỉnh thêm theo kiểu dữ liệu bạn đang dùng)
  index: number; // Vị trí tin nhắn trong mảng messages
  name: string; // Tên người nhận tin nhắn
  isGroupChat: boolean; // Kiểm tra nếu là nhóm
  time: string; // Thời gian tin nhắn
}

export default function RecieverMessage({
  img,
  content,
  messages,
  index,
  name,
  isGroupChat,
  time,
}: RecieverMessageProps) {

  const messageTime = new Date(time);

  if (isSameUser(messages, index) && isGroupChat) {
    return (
      <div className="flex flex-row justify-start my-1">
        <div className="bg-[#FFFFFF]  rounded-tr-xl ml-[45px] font-Roboto rounded-br-xl rounded-bl-xl box-border px-2 py-2  max-[900px]:text-sm flex justify-between">
          <div>
            {content}
          </div>
          <p className=" text-[11px] pl-2 pt-3 flex items-end font-medium">{`${String(messageTime.getHours() % 12 || 12).padStart(2, '0')}:${String(messageTime.getMinutes()).padStart(2, '0')} ${messageTime.getHours() >= 12 ? 'pm' : 'am'}`}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[60%]">
      <div className="flex flex-row justify-start my-1">
        {isGroupChat && (
          <Tooltip title={name} arrow placement="top-start">
            <Avatar
          alt="User-pic"
          style={{
            width: '48px', // Default width
            height: '48px', // Default height
          }}
        />
          </Tooltip>
        )}
        <div className="bg-[#FFFFFF] max-w-[100%] relative rounded-tr-lg ml-[1%] font-Roboto rounded-br-lg rounded-bl-lg box-border px-2 pt-2 pb-2 flex flex-col items-end max-[900px]:text-sm flex justify-between">
          <p className="w-[100%] min-w-[50px] pe-5 pb-2" style={{ wordWrap: "break-word" }}>
            {content}
          </p>
          <p className="absolute bottom-[3px] right-2 text-[9px] pl-2 flex items-end font-medium">
            {`${String(messageTime.getHours() % 12 || 12).padStart(2, '0')}:${String(messageTime.getMinutes()).padStart(2, '0')} ${messageTime.getHours() >= 12 ? 'pm' : 'am'}`}
          </p>
        </div>
      </div>
    </div>
  );
}
