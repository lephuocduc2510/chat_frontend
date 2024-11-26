import React from "react";
import { Avatar } from "@mui/material";
import { isSameUser } from "../../helper/Reusable";
import Tooltip from "@mui/material/Tooltip";

// Định nghĩa kiểu dữ liệu cho props
interface RecieverMessageProps {
  imageUrl?: string; 
  content: string; 
  index: number; // Vị trí tin nhắn trong mảng messages
  name: string; // Tên người nhận tin nhắn
  time: string; // Thời gian tin nhắn
}

export default function RecieverMessage({
  imageUrl,
  content,
  index,
  name,
  time,
}: RecieverMessageProps) {

  const messageTime = new Date(time);


  
  // if ((messages, index) ) {
  //   return (
  //     <div className="flex flex-row justify-start my-1">
  //       <div className="bg-[#FFFFFF]  rounded-tr-xl ml-[45px] font-Roboto rounded-br-xl rounded-bl-xl box-border px-2 py-2  max-[900px]:text-sm flex justify-between">
  //         <div>
  //           {content}
  //         </div>
  //         <p className=" text-[11px] pl-2 pt-3 flex items-end font-medium">{`${String(messageTime.getHours() % 12 || 12).padStart(2, '0')}:${String(messageTime.getMinutes()).padStart(2, '0')} ${messageTime.getHours() >= 12 ? 'pm' : 'am'}`}</p>
  //       </div>
  //     </div>
  //   );
  // }


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
  <div className="flex flex-col max-w-[85%]">
    {/* Tên người nhắn */}
    <p className="text-sm text-gray-800 font-medium mb-1">
      {name}
    </p>

    {/* Tin nhắn */}
    <div className="bg-[#0284C7] relative rounded-tl-lg rounded-tr-lg rounded-bl-lg font-Roboto rounded-br-lg text-white px-3 py-1 shadow-md flex flex-col gap-1">
      <p className="w-full min-w-[50px] mt-1" style={{ wordWrap: "break-word" }}>
        {content}
      </p>
      <p className="text-[10px] text-right text-gray-200 font-light">
        {`${String(messageTime.getHours() % 12 || 12).padStart(2, '0')}:${String(messageTime.getMinutes()).padStart(2, '0')} ${messageTime.getHours() >= 12 ? 'PM' : 'AM'}`}
      </p>
    </div>
  </div>
</div>


    </div>
  );
}
