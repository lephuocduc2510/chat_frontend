import React, { useEffect, useRef, useState } from "react";
import { BsPinAngleFill } from "react-icons/bs";
import { FaEdit, FaThumbtack, FaTrash } from "react-icons/fa";
import { FaThumbtackSlash } from "react-icons/fa6";
import { Popconfirm, message } from "antd";
import { Axios } from "axios";
import { axiosClient } from "../../libraries/axiosClient";
import { TooltipRef } from "antd/es/tooltip";
import EditMessageModal from "./EditMessageModal";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Room } from "@mui/icons-material";

interface SenderMessageProps {
  id: string; // ID của tin nhắn
  time: string;
  content: string;
  isPinned: boolean;
  fileUrl?: string;
  roomId: number;
}

export default function SenderMessage({
  id,
  time,
  content,
  isPinned,
  fileUrl,
  roomId
}: SenderMessageProps) {
  const [checkActiveMessageId, setActiveMessageId] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const popconfirmRef = useRef<HTMLElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<{ id: string; content: string }>({ id: "", content: "" });
   const socket = useSocket();
  const [newMessage, setNewMessage] = useState(content);
   const newMessageRedux = useSelector((state: RootState) => state.messages);
 

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


  
    useEffect(() => {
   
      if (newMessageRedux) {
        if (newMessageRedux._id === id) {
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
              
            
      //       // if (data.type === 'update' && data.roomId === roomId) {
      //       //   console.log('Message updated:', data._id, data.content);
      //       // }
      //     });
      
      //     // Cleanup
      //     return () => {
      //       socket.off('server-message');
      //     };
      //   }
      // }, [socket, roomId]);
  

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
        if(socket){
          socket.emit('client-message', {
            type: 'delete',
            _id: messageId,
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
        if(socket){
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
    <div className="max-w-[60%] ml-auto h-auto">
      <div className="flex flex-row relative justify-end my-1 max-w-[100%] h-auto">
        <div className="bg-[#014DFE] max-w-[100%] relative rounded-tl-lg rounded-tr-lg rounded-bl-lg font-Roboto rounded-br-lg text-white box-border px-2 pt-2 pb-2 flex flex-col items-end">
          {/* Nội dung tin nhắn */}
          <p
            className="w-[100%] min-w-[50px] pb-2"
            style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: newMessage }}
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
