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
import { selectChat, updateChat } from "../../redux/Chat/chatSlice";

// Định nghĩa kiểu Message
interface Message {
  messageId: number;
  content: string;
  sentAt: string;
  isPinned: boolean;
  fileUrl?: string;
  userId: string;
  user: {
    name: string;
    imageUrl?: string;
    id: string;
    userName: string;
    email: string;
    [key: string]: any;
  };
  roomId: number;
  isRead: boolean;
};

export default function ChatMessages() {
  const dispatch = useDispatch();
  const storedData = JSON.parse(localStorage.getItem("info") || "{}");
  const userId = storedData.id;

  const selectedChat = useSelector((state: RootState) => state.chat.selectedChatId);
  const checkChatUpdate = useSelector((state: RootState) => state.chat.messages);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const [shouldScroll, setShouldScroll] = useState(false);
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const handleMouseEnter = (messageId: number) => {
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

      const response = await axiosClient.get(`/api/Messages/room/${selectedChat}`, config);
      if (response.data.result?.[response.data.result.length - 1]?.userId === userId) {
        setShouldScroll(true);
      } else {
        if (isNearBottom()) {
          setShouldScroll(true);
          setShowNewMessageAlert(false);
        } else {
          setShowNewMessageAlert(true);
        }
      }

      setMessages(response.data.result || []);
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

  const handleDeleteMessage = async (messageId: number) => {
    const userConfirmed = window.confirm("Bạn có chắc chắn muốn xóa tin nhắn này không?");
    if (!userConfirmed) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      await axiosClient.delete(`/api/Messages/${messageId}`, config);
      setMessages(prevMessages => prevMessages.filter(message => message.messageId !== messageId));
      alert("Xóa tin nhắn thành công!");
    } catch (error) {
      alert("Có lỗi xảy ra khi xóa tin nhắn.");
      console.error(error);
    }
  };

  const isValidDate = (date: string) => !isNaN(new Date(date).getTime());

  const formatDateHeader = (date: string): string => {
    if (!isValidDate(date)) {
      return "Invalid date";
    }

    const messageDate = new Date(date);
    if (isToday(messageDate)) return "Today";
    if (isYesterday(messageDate)) return "Yesterday";
    return format(messageDate, "d MMMM yyyy");
  };

  const isMessageNewDay = (current: Message, previous?: Message): boolean => {
    return !previous || formatDateHeader(current.sentAt) !== formatDateHeader(previous.sentAt);
  };

  return (
    <div
      ref={containerRef}
      className="w-[100%] h-[88%] px-[3%] overflow-y-scroll no-scrollbar py-[2%] box-border relative flex flex-col"
    >
      {!loading && messages.length === 0 && <EmptyMessages />}

      {messages.map((message, index) => {
        const isSender = message.userId === userId;
        const userName = message.user?.name || "Unknown User";
        const userImage = message.user?.imageUrl || "default-profile.jpg";
        const showDateHeader = isMessageNewDay(message, messages[index - 1]);

        return (
          <div
            key={message.messageId}
            className="relative"
            onMouseEnter={() => handleMouseEnter(message.messageId)}
            onMouseLeave={handleMouseLeave}
          >
            {showDateHeader && (
              <div className="rounded-md px-4 py-2 my-4 bg-slate-200 text-slate-600 font-medium text-sm text-center">
                {formatDateHeader(message.sentAt)}
              </div>
            )}

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

            {hoveredMessageId === message.messageId && (
              <div
                className="absolute top-1 right-2 cursor-pointer"
                onClick={() => handleDeleteMessage(message.messageId)}
              >
                &#x22EE;
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
