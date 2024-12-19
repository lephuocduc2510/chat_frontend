

import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { BsPinAngleFill } from "react-icons/bs";
import { FaEdit, FaThumbtack, FaTrash } from "react-icons/fa";
import { FaThumbtackSlash } from "react-icons/fa6";
import { Popconfirm, message } from "antd";
import { axiosClient } from "../../libraries/axiosClient";
import EditMessageModal from "./EditMessageModal";
import { set } from "date-fns";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// Định nghĩa kiểu dữ liệu cho props
interface RecieverMessageProps {
  id: string; // ID của tin nhắn
  avatar?: string;
  content: string;
  index: number; // Vị trí tin nhắn trong mảng messages
  name: string; // Tên người nhận tin nhắn
  time: string; // Thời gian tin nhắn
  isPinned: boolean; // Kiểm tra tin nhắn đã được ghim hay chưa
  fileUrl?: string; // URL file đính kèm (nếu có)
  roomId: number; // ID của phòng chat
}

export default function RecieverMessage({
  id,
  avatar,
  content,
  index,
  name,
  time,
  isPinned,
  fileUrl,
  roomId
}: RecieverMessageProps) {
  const messageTime = time ? time : ""
  const [checkActiveMessageId, setActiveMessageId] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<{ id: string; content: string }>({ id: "", content: "" });
  const [newMessage, setNewMessage] = useState(content);
  const newMessageRedux = useSelector((state: RootState) => state.messages);
  const socket = useSocket();

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
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Chuyển đổi giờ 24h sang 12h
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  useEffect(() => {
  
    if (newMessageRedux) {
      if (newMessageRedux._id === id) {
        console.log('dđ:', newMessageRedux);
        setNewMessage(newMessageRedux.content);
      }
    }
  }, [newMessageRedux, id]);



  // useEffect(() => {
  //   if (socket) {
  //     socket.on('connect', () => {
  //       console.log('Socket connected');
  //     });
  //     socket.on('server-message', (data) => {        
  //       if (data.type === 'update' && data.roomId === roomId && data._id === id) {
  //         console.log('Message updated:', data._id, data.content);
  //         setNewMessage(data.content);

  //       }


  //       // if (data.type === 'delete' && data.roomId === roomId && data._id === id) {
  //       //   console.log('Message updated:', data._id, data.content);
  //       //   setNewMessage("");
  //       // }
  //     });

  //     // Cleanup
  //     return () => {
  //       socket.off('server-message');
  //     };
  //   }
  // }, [socket, roomId, id]);


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
        if (socket) {
          socket.emit('client-message', {
            type: 'delete',
            _id: id,
            content: newMessage,
            roomId: roomId,
          });
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa tin nhắn.");
    }
  };



  const handleOpenEditModal = (messageId: string, messageContent: string) => {
    setCurrentMessage({ id: messageId, content: messageContent }); // Lấy nội dung tin nhắn hiện tại
    setIsModalOpen(true); // Mở modal
  };

  const handleSaveEditedMessage = (id: string, newMessage: string) => {
    console.log("ID tin nhắn:", id);
    console.log("Nội dung mới:", newMessage);
    // Thực hiện cập nhật tin nhắn
    const updateMessage = async () => {
      try {
        const response = await axiosClient.patch(`/messages/${id}`, { content: newMessage });
        console.log(response);
        if (response.status !== 200) {
          message.error("Có lỗi xảy ra khi sửa tin nhắn.");
          return;
        }
        setNewMessage(newMessage);
        message.success("Sửa tin nhắn thành công!");
        if (socket) {
          socket.emit('client-message', {
            type: 'update',
            _id: id,
            content: newMessage,
            roomId: roomId,
          });
        }
      } catch (error) {
        message.error("Có lỗi xảy ra khi sửa tin nhắn.");
      }
    }
    updateMessage();
    setIsModalOpen(false);
    setCurrentMessage({ id: id, content: newMessage });
  };

  return (
    <div className="max-w-[60%]">
      <div className="flex flex-row items-start my-2 gap-3">
        {/* Avatar với tooltip */}
        <Tooltip title={name} arrow placement="top-start">
          <Avatar
            alt="User-pic"
            src={avatar || "https://via.placeholder.com/150"} // Nếu không có ảnh, sử dụng placeholder
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
          <div className="bg-[#0284C7] relative rounded-tl-lg rounded-tr-lg rounded-bl-lg font-Roboto rounded-br-lg text-white px-3 py-1 shadow-md flex flex-col gap-1">
            {/* Nội dung tin nhắn */}
            <p className="w-full min-w-[50px] mt-1" style={{ wordWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: newMessage }} />

            {/* Hiển thị file nếu có */}
            {fileUrl && (
              <div>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  [File]
                </a>
              </div>
            )}


            {/* Thời gian tin nhắn */}
            <p className="text-[10px] text-right text-gray-200 font-light">
              {formatTime(messageTime)}
            </p>

            {/* Icon menu chức năng */}
            <div
              className="absolute top-1 right-[-20px] cursor-pointer text-gray-500 hover:text-black"
              onClick={() => setActiveMessageId((prev) => !prev)}
            >
              &#x22EE;
            </div>
          </div>


          {/* Menu chức năng */}
          {checkActiveMessageId && (
            <div
              ref={menuRef}
              className="absolute top-[50px] left-[100px] bg-white shadow-lg rounded-lg border border-gray-200 py-1.5 px-3 z-20 min-w-[160px]"
            >
              <button
                className="flex items-center text-sm text-gray-700 hover:text-blue-600 py-1 px-3 w-full text-left hover:bg-gray-100 rounded-md"
                onClick={() => {
                  handleOpenEditModal(id, newMessage)
                }
                } // Mở modal chỉnh sửa
              >
                <span className="mr-2">
                  <FaEdit />
                </span>
                Sửa tin nhắn
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

      {isModalOpen && (
        <EditMessageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message={currentMessage}
          onSave={handleSaveEditedMessage}
        />
      )}
    </div>
  );
}
