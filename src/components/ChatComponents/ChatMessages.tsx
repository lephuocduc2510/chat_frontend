import React, { useEffect, useRef, useState } from "react";
import RecieverMessage from "./RecieverMessage";
import SenderMessage from "./SenderMessage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { axiosClient } from "../../libraries/axiosClient";
import CircularLoading from "./CircularLoading";
import EmptyMessages from "./EmptyMessages";
import { format } from 'date-fns';
import { isToday, isYesterday } from 'date-fns';
import { FaThumbtack, FaTrash } from 'react-icons/fa';
import { FaThumbtackSlash } from "react-icons/fa6";
import { Popconfirm, message } from "antd";
import { useSocket } from "../../context/SocketContext";

// Định nghĩa kiểu Message
interface Message {
  _id?: string;
  content: string;
  sentAt?: string;
  timestamp: string;
  // fileUrl?: string;
  senderId: string;
  nameUser: string;
  avatar?: string;
  roomId: number;
  isPinned?: boolean;
};


// interface Message {
//   messageId: number;
//   content: string;
//   sentAt: string;
//   isPinned: boolean;
//   fileUrl?: string;
//   idUser: string;
//   nameUser: string;
//   imageUrl?: string;
//   id: string;
//   userName: string;
//   email: string;
//   [key: string]: any;
//   roomId: number;
//   isRead: boolean;
// };

export default function ChatMessages() {
  const dispatch = useDispatch();
  const storedData = JSON.parse(localStorage.getItem("info") || "{}");
  const userId = storedData.id;
  const selectedChat = useSelector((state: RootState) => state.chat.selectedChatId);
  const checkChatUpdate = useSelector((state: RootState) => state.chat.messages);
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);




  // lắng nghe tin nhắn từ server để load lại tin nhắn
  // Hàm để tạo đối tượng Date từ timestamp (chỉ giờ, phút, giây)
  const createDateFromTimestamp = (timestamp: string) => {
    const [hours, minutes, seconds] = timestamp.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, seconds, 0);  // Thiết lập giờ, phút, giây cho ngày hiện tại
    return now;
  };

  // Hàm để format thời gian
  const formatDateHeader = (timestamp: string) => {
    const messageDate = createDateFromTimestamp(timestamp);

    if (isToday(messageDate)) {
      return 'Hôm nay';
    }

    if (isYesterday(messageDate)) {
      return 'Hôm qua';
    }

    return format(messageDate, 'dd/MM/yyyy'); // Hiển thị ngày nếu không phải hôm nay hoặc hôm qua
  };

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Socket connected');
      });
      socket.on('server-message', (data) => {
        if (data.type === 'chat' && data.roomId === selectedChat) {
          console.log('Message matches room', data);
          saveMessage(data.roomId, data.idUser, data.message, data.nameUser, data.timestamp);
          // setMessages((prev) => [...prev, data]);    
        }
      });

      // Cleanup
      return () => {
        socket.off('server-message');
      };
    }
  }, [socket, selectedChat]);



  // save message
  const saveMessage = (roomId: string, userId: string, messageContent: string, nameUser: string, timestamp: string) => {
    setMessages(prevMessages => [
      ...prevMessages,
      {

        roomId: parseInt(roomId),
        senderId: userId,
        content: messageContent,
        nameUser: nameUser,
        timestamp
      }
    ]);
    console.log('Message saved:', messageContent);
  };


  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const handleMouseEnter = (messageId: string) => {
    setHoveredMessageId(messageId);
  };

  const handleMouseLeave = () => {
    setHoveredMessageId(null);
  };

  const getMessages = async () => {
    if (!selectedChat) return;

    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await axiosClient.get(`/messages/room/${selectedChat}`, config);
      if (response.data.result?.[response.data.length - 1]?.senderId === userId) {
        setShouldScroll(true);
      } else {
        if (isNearBottom()) {
          setShouldScroll(true);
          setShowNewMessageAlert(false);
        } else {
          setShowNewMessageAlert(true);
        }
      }

      setMessages(response.data || []);
      console.log("Messages:", response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
    setMessages([]);
  }, [selectedChat]);

  useEffect(() => {
    getMessages();
  }, [checkChatUpdate]);
  // Cuộn xuống khi cần
  useEffect(() => {
    if (shouldScroll) {
      scrollToBottom();
      setShouldScroll(false); // Reset trạng thái sau khi cuộn
    }
  }, [loading]);

  const isNearBottom = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      return scrollHeight - scrollTop <= clientHeight + 10;
    }
    return false;
  };

  const handleNewMessageClick = () => {
    scrollToBottom();
    setShowNewMessageAlert(false);
  };

  const handleDeleteMessage = async (messageId: any) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      await axiosClient.delete(`/api/Messages/${messageId}`, config);
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId.toString())
      );
      message.success("Xóa tin nhắn thành công!");
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa tin nhắn.");
      console.error(error);
    }
  };






  return (
    <div
      ref={containerRef}
      className="w-[100%] h-[88%] px-[3%] overflow-y-scroll no-scrollbar py-[2%] box-border relative flex flex-col"
    >
      {!loading && messages.length === 0 && <EmptyMessages />}

      {messages.map((message, index) => {
        const isSender = message.senderId === userId;
        const userName = message.nameUser || "Unknown User";
        const userImage = message?.avatar || "default-profile.jpg";



        return (
          <div
            key={message._id}
            className="relative"
            onMouseEnter={() => message._id && handleMouseEnter(message._id)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Hiển thị tiêu đề ngày */}
            {index === 0 || formatDateHeader(message.timestamp) !== formatDateHeader(messages[index - 1].timestamp) ? (
              <div className="rounded-md px-4 py-2 my-4 bg-slate-200 text-slate-600 font-medium text-sm text-center">
                {formatDateHeader(message.timestamp)}
              </div>
            ) : null}

            {isSender ? (
              <SenderMessage
                time={message.timestamp}
                content={message.content}
                isPinned={message.isPinned ?? false}
              />
            ) : (
              <RecieverMessage
                key={message._id}
                name={userName}
                avatar={userImage}
                index={index}
                content={message.content}
                time={message.timestamp}
                isPinned={message.isPinned ?? false}
              />
            )}

            {hoveredMessageId === message._id && (
              <div
                className="absolute top-1 right-2 cursor-pointer"
                // onClick={() => handleDeleteMessage(message.messageId)}
                onClick={() =>
                  setActiveMessageId(
                    activeMessageId === message._id ? null : message._id || null
                  )}
              >

                &#x22EE;
              </div>
            )}
            {/* Menu chức năng ghim và xóa tin nhắn */}
            {activeMessageId === message._id && (
              <div className="absolute top-8 right-4 bg-white shadow-lg rounded-lg border border-gray-200 py-1.5 px-2 z-20">
                <button
                  className="flex items-center text-sm text-gray-700 hover:text-blue-600 py-1 px-3 w-full text-left hover:bg-gray-100 rounded-md"
                  onClick={() => {
                    // pinMessage(message._id);
                    setActiveMessageId(null); // Ẩn menu sau khi chọn
                  }}
                >
                  <span className="mr-2">
                    {message.isPinned ? <FaThumbtackSlash /> : <FaThumbtack />}
                  </span>
                  {message.isPinned ? "Bỏ ghim tin nhắn" : "Ghim tin nhắn"}
                </button>

                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa tin nhắn này không?"
                  onConfirm={() => handleDeleteMessage(message._id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  placement="topRight"
                >
                  <button className="flex items-center text-sm text-gray-700 hover:text-red-600 py-1 px-3 w-full text-left hover:bg-gray-100 rounded-md">
                    <span className="mr-2">
                      <FaTrash />
                    </span>
                    Xóa tin nhắn
                  </button>
                </Popconfirm>
              </div>
            )}
          </div>
        );
      })}
      {showNewMessageAlert && (
        <div
          className="sticky bottom-4 left-4 w-[35%] bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-md border border-blue-300 cursor-pointer"
          onClick={handleNewMessageClick}
        >
          Bạn có tin nhắn mới!
        </div>
      )}
    </div>
  );
}