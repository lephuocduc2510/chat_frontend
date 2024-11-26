import React, { useEffect, useState } from "react";
import RecieverMessage from "./RecieverMessage";
import SenderMessage from "./SenderMessage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { axiosClient } from "../../libraries/axiosClient";
import CircularLoading from "./CircularLoading";
import EmptyMessages from "./EmptyMessages";
import { format } from 'date-fns'; // Thư viện để định dạng ngày
import { isToday, isYesterday } from 'date-fns';
import { selectChat, updateChat } from "../../redux/Chat/chatSlice";
import { get } from "http";


// Định nghĩa kiểu Message
interface Message {
  messageId: number;
  content: string;
  sentAt: string;
  isPinned: boolean;
  fileUrl?: string; // Dữ liệu file nếu có
  userId: string; // ID của người gửi
  user: {
    name: string;
    imageUrl?: string; // URL ảnh đại diện
    id: string;
    userName: string;
    email: string;
    [key: string]: any; // Nếu có thêm thuộc tính khác
  };
  roomId: number;
  isRead: boolean;
}

export default function ChatMessages() {
  // Lấy thông tin người dùng hiện tại từ localStorage
  const dispatch = useDispatch();
  const storedData = JSON.parse(localStorage.getItem("info") || "{}");
  const userId = storedData.id;
  // Redux: lấy thông tin phòng chat được chọn
  const selectedChat = useSelector((state: RootState) => state.chat.selectedChatId);
  const checkChatUpdate = useSelector((state: RootState) => state.chat.messages);
  // State để lưu trữ danh sách tin nhắn
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);


  
  
  // Hàm lấy tin nhắn từ API
  const getMessages = async () => {
    if (!selectedChat) return;

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const response = await axiosClient.get(`/api/Messages/room/${selectedChat}`, config);
      setMessages(response.data.result || []);

      // dispatch(updateChat(response.data.result || []));

    } catch (error) {
      console.error(selectedChat);
    } finally {
      setLoading(false);
    }
  };

  // Lấy tin nhắn khi `selectedChat` thay đổi
  useEffect(() => {
    getMessages(); // Gọi API khi selectedChat thay đổi
    setMessages([]); // Reset messages khi selectedChat thay đổi
  }, [selectedChat]);

  useEffect(() => {
    getMessages();
  }, [checkChatUpdate]);

  // useEffect(() => {

  //     setMessages(messagesRedux); // Cập nhật messages từ Redux
  //     console.log(messagesRedux);
  //     getMessages();

  // }, [messagesRedux]);

  // Hàm format ngày
  const isValidDate = (date: string) => !isNaN(new Date(date).getTime());

  const formatDateHeader = (date: string): string => {
    if (!isValidDate(date)) {
      return "Invalid date";
    }

    const messageDate = new Date(date);
    if (isToday(messageDate)) {
      return "Today";
    } else if (isYesterday(messageDate)) {
      return "Yesterday";
    } else {
      return format(messageDate, "d MMMM yyyy");
    }
  };

  const isMessageNewDay = (current: Message, previous?: Message): boolean => {
    return !previous || formatDateHeader(current.sentAt) !== formatDateHeader(previous.sentAt);
  };


  return (
    <div className="w-[100%] h-[88%] px-[3%] overflow-y-scroll no-scrollbar py-[2%] box-border relative flex flex-col">
      {/* Loading và thông báo nếu không có tin nhắn */}
      {loading && <CircularLoading />}
      {!loading && messages.length === 0 && <EmptyMessages />}

      {/* Hiển thị các tin nhắn */}
      {messages.map((message, index) => {
        const isSender = message.userId === userId;
        const userName = message.user?.name || "Unknown User";
        const userImage = message.user?.imageUrl || "default-profile.jpg";

        // Kiểm tra nếu tin nhắn hiện tại và tin nhắn trước có cùng ngày
        const showDateHeader = isMessageNewDay(message, messages[index - 1]);

        return (
          <div key={message.messageId}>
            {/* Nếu tin nhắn là tin nhắn mới ngày thì hiển thị tiêu đề ngày */}
            {showDateHeader && (
              <div className="rounded-md px-4 py-2 my-4 bg-slate-200 text-slate-600 font-medium text-sm text-center">
                {formatDateHeader(message.sentAt)} {/* Hiển thị ngày đã định dạng */}
              </div>
            )}

            {/* Render tin nhắn của người gửi hoặc người nhận */}
            {isSender ? (
              <SenderMessage
                time={message.sentAt}
                content={message.content}
              />
            ) : (
              <RecieverMessage
                key={message.messageId}
                name={userName}
                imageUrl={userImage}
                index={index}
                content={message.content}
                time={message.sentAt}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
