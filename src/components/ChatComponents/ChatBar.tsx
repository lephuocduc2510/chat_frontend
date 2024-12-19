import React, { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import Badge from './util/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { selectChat, updateChat, updateNameRoom, updateRoomDeleted } from '../../redux/Chat/chatSlice';
import { RootState } from '../../redux/store';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { message } from 'antd';
import { addMessage } from '../../redux/Chat/chatLatestSlice';
import logoGroup from '../../assets/images/group.png';
import { updateLogo, updateRoom } from '../../redux/Chat/roomSlice';
import { FaImage } from 'react-icons/fa';

interface MessageData {
  content?: string;
  userId: string;
  sentAt: string;
  fileUrl?: string;
  roomId: string;
  nameUser?: string;
}

// Định nghĩa kiểu cho props
interface ChatBarProps {
  data: {
    roomId: string;
    name: string;
    lastMessage?: string;
    senderId: string;
    senderName: string;
    sendAt: string
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
  const groupName = data.name || 'Group Chat'; // Tên nhóm mặc định
  // const isExcedding = data.latestMessage && data.latestMessage.content.length > 35;
  const groupImg = data.groupLogo; // Lấy ảnh đại diện của nhóm hoặc người dùng đầu tiên
  const storedData = JSON.parse(localStorage.getItem("info") || "{}");
  const userId = storedData.id;
  const checkMessage = useSelector((state: RootState) => state.chat.messages);
  const [isJoined, setIsJoined] = useState(false);
  const [users, setUsers] = useState<string[]>([]);
  const [chatLatest, setChatLatest] = useState<MessageData>({ content: data.lastMessage, userId: data.senderId, nameUser: data.senderName, fileUrl: '', roomId: data.roomId, sentAt: data.sendAt });
  const [time, setTime] = useState<string>("");
  const dateObject = new Date(time);
  const chat = useSelector((state: RootState) => state.chatLatest);


  const handleSelect = async () => {
    dispatch(selectChat(data.roomId));
    dispatch(updateNameRoom(data.name));
    dispatch(updateLogo(groupImg || ''));
    select(data); // Gọi thêm hàm select từ props (nếu cần)

  };



  useEffect(() => {
    if (chat && typeof chat === "object" && chat[data.roomId]) { // Kiểm tra chat không rỗng và roomId hợp lệ
      setChatLatest(chat[data.roomId]);
      console.log("chatLatest", chat);
    }
  }, [chat, data.roomId]);


  return (
    <div
    style={{
      backgroundColor: data.roomId === selectedChatId ? '#F3F4F6' : undefined, // Highlight room nếu được chọn
    }}
    onClick={handleSelect}
    className="flex flex-row items-center justify-between rounded-md cursor-pointer mx-[2%] my-[5%] hover:bg-gray-100 px-[5%] py-[2%]"
  >
    {/* Phần hiển thị thông tin nhóm/chat */}
    <div className="flex flex-row items-center">
      {/* Avatar của nhóm */}
      <Avatar
        alt="Group Logo"
        style={{ width: '48px', height: '48px' }}
        src={groupImg || logoGroup} // Hình ảnh logo nhóm
      />
      {/* Nội dung chính của chat */}
      <div className="flex flex-col ml-2">
        {/* Tên nhóm */}
        <div className="font-bold font-Roboto text-sm">{groupName}</div>
        {/* Tin nhắn gần nhất */}
        <div className="text-xs text-[#979797]">
          {chatLatest?.content  && (
            userId !== chatLatest?.userId ? (
              <span>
                {chatLatest.nameUser}: {chatLatest.content}
              </span>
            ) : (
              <span>
                Bạn: {chatLatest.content}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  
    {/* Phần hiển thị thông báo và thời gian */}
    <div className="flex flex-col items-end">
      {/* Thời gian tin nhắn gần nhất */}
      <div className="text-xs max-[800px]:hidden font-medium cursor-pointer text-[#979797]">
        {/* {chatLatest?.sentAt} */}
      </div>
      {/* Thông báo nếu có */}
      <div className="mt-1">
        {data.notify && <Badge>1</Badge>}
      </div>
    </div>
  </div>
  
  );
}


