import React, { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import Badge from './util/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { selectChat, updateChat, updateNameRoom, updateRoomDeleted } from '../../redux/Chat/chatSlice';
import { RootState } from '../../redux/store';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useSignalR } from '../../context/SignalRContext';
import { message } from 'antd';
import { addMessage } from '../../redux/Chat/chatLatestSlice';
import { FaImage } from 'react-icons/fa';
import { axiosClient } from '../../libraries/axiosClient';

interface MessageData {
  content: string;
  userId: string;
  sentAt: string;
  fileUrl?: string;
  roomId: string;
  name: string;
}

// Định nghĩa kiểu cho props
interface ChatBarProps {
  data: {
    namePerMessLast: string
    idPerMessLast: string;
    idRooms: string;
    roomName: string;
    lastMessageContent: string;
    lastMessageSentAt: string
    createdDate: string;
    isActive: boolean;
    notify?: boolean;
    groupLogo?: string;
    description?: string;
  };
  select: (data: any) => void; // Điều chỉnh kiểu nếu `select` có thể cụ thể hơn
}

export default function ChatBar({ data, select }: ChatBarProps) {
  const dispatch = useDispatch();
  const selectedChatId = useSelector((state: RootState) => state.chat.selectedChatId);
  const room = useSelector((state: RootState) => state.rooms.rooms);
  const groupName = data.roomName || 'Group Chat'; // Tên nhóm mặc định
  const groupImg = data.groupLogo; // Lấy ảnh đại diện của nhóm hoặc người dùng đầu tiên
  const chat = useSelector((state: RootState) => selectedChatId ? state.chatLatest[data.idRooms] : null);
  const storedData = JSON.parse(localStorage.getItem("info") || "{}");
  const userId = storedData.id;
  const { connection } = useSignalR();
  const checkMessage = useSelector((state: RootState) => state.chat.messages);
  const [isJoined, setIsJoined] = useState(false);
  const [users, setUsers] = useState<string[]>([]);
  const [chatLatest, setChatLatest] = useState<MessageData>({ content: data.lastMessageContent, userId: data.idPerMessLast, name: data.namePerMessLast , sentAt: data.lastMessageSentAt, roomId: data.idRooms });
  const [time, setTime] = useState<string>(data.lastMessageSentAt);
  const dateObject = new Date(time);
  const token = localStorage.getItem("token");
  




  // Giả sử lấy content từ phần tử cuối cùng
  const handleSelect = async () => {
    dispatch(selectChat(data.idRooms));
    dispatch(updateNameRoom(data.roomName));
    select(data); // Gọi thêm hàm select từ props (nếu cần)

    if (connection && userId.trim()) {
      try {
        await connection.invoke("JoinRoom", data.idRooms, userId);
        setIsJoined(true);
        connection.on("ReceiveMessage", (messageData) => {
          // setMessages((prevMessages) => [...prevMessages, messageData]);
          // setMessages(checkMessage)

          dispatch(updateChat(messageData));
          const newMessage = {
            content: messageData.content,
            userId: messageData.userId,
            sentAt: messageData.sentAt,
            fileUrl: messageData.fileUrl,
            roomId: messageData.roomId,
            name: messageData.name,
          };
          dispatch(addMessage(newMessage));
          console.log("Message received globally: ", messageData);
        });
        connection.on("UsersInRoom", (usersInRoom) => {
          setUsers(usersInRoom);
        });

        console.log(`Joined Room ${data.idRooms} as ${userId}`);
      } catch (err) {
        console.error("Error while joining room: ", err);
      }
    } else {
      console.error("Invalid User ID or connection issue.");
    }
  };

  // Connect to SignalR


  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => console.log("SignalR Connected!"))
        .catch((error) => console.error("SignalR Connection Error: ", error));
    }
  }, [connection]);


  useEffect(() => {
    if (chat && typeof chat === "object") {
      setChatLatest(chat); // Set chatLatest với đối tượng chat
      setTime(chat.sentAt); // Lấy thời gian từ chat
    }
  }, [chat]);



  return (
    <div
      style={{ backgroundColor: data.idRooms === selectedChatId ? '#F3F4F6' : undefined }} // Sử dụng selectedChatId từ Redux
      onClick={handleSelect}
      className="flex flex-row items-center justify-between rounded-md cursor-pointer mx-[2%] my-[5%] hover:bg-gray-100 px-[5%] py-[2%]"
    >
      <div className="flex flex-row items-center">
        <Avatar
          alt="Group Logo"
          style={{
            width: '48px', // Default width
            height: '48px', // Default height
          }}
          src={groupImg} // Luôn sử dụng groupLogo
        />
        <div className="flex flex-col ml-2">
          <div className="font-bold font-Roboto text-sm">{groupName}</div>
          <div className="text-xs text-[#979797]">

            {userId !== chatLatest.userId ? (
              chatLatest?.content && !chatLatest.content.includes('<a href="') ? (
                <span>
                  {chatLatest.name}: {chatLatest.content}
                </span>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{chatLatest.name}:</span>
                  <span className="font-bold text-sm text-blue-500 flex items-center">
                    <FaImage className="text-xl" />
                  </span>
                </div>
              )
            ) : (
              chatLatest?.content && !chatLatest.content.includes('<a href="') ? (
                <span>
                  Bạn: {chatLatest.content}
                </span>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Bạn:</span>
                  <span className="font-bold text-sm text-blue-500 flex items-center">
                    <FaImage className="text-xl" />
                  </span>
                </div>
              )
            )}

           {chatLatest?.content} 
            {isExcedding ? '.....' : ''}
          </div>


        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-xs max-[800px]:hidden font-medium cursor-pointer text-[#979797]">
          {`${String(dateObject.getHours() % 12 || 12).padStart(2, '0')}:${String(dateObject.getMinutes()).padStart(2, '0')} ${dateObject.getHours() >= 12 ? 'PM' : 'AM'}`}
        </div>
        <div className="mt-1">{data.notify && <Badge>1</Badge>}</div>
      </div>
    </div>
  );
}


