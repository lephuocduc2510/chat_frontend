import React, { useEffect, useRef, useState } from "react";
import { BsPinAngleFill } from "react-icons/bs";
import { FaEdit, FaThumbtack, FaTrash } from "react-icons/fa";
import { FaThumbtackSlash } from "react-icons/fa6";
import { Popconfirm, message } from "antd";
import { Axios } from "axios";
import { axiosClient } from "../../libraries/axiosClient";
import { TooltipRef } from "antd/es/tooltip";

interface SenderMessageProps {
  id: string; // ID của tin nhắn
  time: string;
  content: string;
  isPinned: boolean;
  fileUrl?: string;
}

export default function SenderMessage({
  id,
  time,
  content,
  isPinned,
  fileUrl,
}: SenderMessageProps) {
  const [checkActiveMessageId, setActiveMessageId] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const popconfirmRef = useRef<HTMLElement | null>(null);

  // Xử lý click bên ngoài menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMessageId(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const handleEditMessage = async (messageId: string) => {
    try {
      const response = await axiosClient.put(`/messages/${messageId}`);
      console.log(response);
      if (response.status !== 200) {
        message.error("Có lỗi xảy ra khi sửa.");
        return;
      }
      else {
        message.success("Sửa tin nhắn thành công!");
        setActiveMessageId(false);
      }
    }
    catch (error) {
      message.error("Có lỗi xảy ra khi sủa tin nhắn.");
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await axiosClient.delete(`/messages/messages/${messageId}`);
      console.log(response);
      if (response.status !== 200) {
        message.error("Có lỗi xảy ra khi xóa tin nhắn.");
        return;
      }
      else {
        message.success("Xóa tin nhắn thành công!");
        setActiveMessageId(false);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa tin nhắn.");
    }
  };

  return (
    <div className="max-w-[60%] ml-auto h-auto">
      <div className="flex flex-row relative justify-end my-1 max-w-[100%] h-auto">
        <div  className="bg-[#014DFE] max-w-[100%] relative rounded-tl-lg rounded-tr-lg rounded-bl-lg font-Roboto rounded-br-lg text-white box-border px-2 pt-2 pb-2 flex flex-col items-end">
          {/* Nội dung tin nhắn */}
          <p
            className="w-[100%] min-w-[50px] pb-2"
            style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {fileUrl && (
            <div>
              <a
                href={fileUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-200 underline"
              >
                [File]
              </a>
            </div>
          )}
          {isPinned && (
            <BsPinAngleFill
              className="absolute top-2 right-2 text-yellow-400"
              size={16}
            />
          )}
          {/* Thời gian */}
          <p className="absolute bottom-[3px] right-2 text-[9px] pl-2 flex items-end font-medium">
            {formatTime(time)}
          </p>

          {/* Icon menu chức năng */}
          <div
            className="absolute top-1 left-[-20px] cursor-pointer text-gray-500 hover:text-black"
            onClick={() => setActiveMessageId((prev) => !prev)}
          >
            &#x22EE;
          </div>
        </div>



        {/* Menu chức năng */}
        {checkActiveMessageId && (
          <div
            ref={menuRef}
            className="absolute top-8 right-4 bg-white shadow-lg rounded-lg border border-gray-200 py-1.5 px-2 z-20"
          >
            <button
              className="flex items-center text-sm text-gray-700 hover:text-blue-600 py-1 px-3 w-full text-left hover:bg-gray-100 rounded-md"
              onClick={() => handleEditMessage(id)} // Giữ sự kiện onClick
            >
              <span className="mr-2">
                <FaEdit /> {/* Thay đổi biểu tượng từ FaThumbtack sang FaEdit cho việc sửa */}
              </span>
              Sửa tin nhắn {/* Thay đổi văn bản */}
            </button>
            {/*           
            <Popconfirm        
              title="Bạn có chắc chắn muốn xóa tin nhắn này không?"
              onConfirm={() => handleDeleteMessage(id)}
              okText="Xóa"
              cancelText="Hủy"
              placement="topRight"
            
            > */}

            <button onClick={() => handleDeleteMessage(id)} className="flex items-center text-sm text-gray-700 hover:text-red-600 py-1 px-3 w-full text-left hover:bg-gray-100 rounded-md">
              <span className="mr-2">
                <FaTrash />
              </span>
              Xóa tin nhắn
            </button>

            {/* </Popconfirm> */}
          </div>
        )}
      </div>
    </div>
  );
}
