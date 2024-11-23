import React from 'react';
import { Avatar } from '@mui/material';
import Badge from './util/Badge';
import { getSender } from '../../helper/Reusable';
import groupLogo from '../../assets/images/group.png';

// Định nghĩa kiểu cho props
interface ChatBarProps {
  data: {
    _id: string;
    isGroupChat: boolean;
    chatName?: string;
    users: Array<{ _id: string; name: string; pic: string }>;
    latestMessage?: { content: string };
    updatedAt: string;
    notify?: boolean;
  };
  select: (data: any) => void; // Điều chỉnh kiểu nếu `select` có thể cụ thể hơn
}

export default function ChatBar({ data, select }: ChatBarProps) {
  const isGroupChat = data.isGroupChat;

  let user: { name: string; pic?: string };
  if (isGroupChat) {
    user = { name: data.chatName || 'Group Chat' };
  } else {
    user = getSender(data.users); // Đảm bảo `getSender` trả về kiểu dữ liệu tương ứng
  }

  const latestMessage = data.latestMessage ? data.latestMessage.content.slice(0, 35) : '';
  const isExcedding = data.latestMessage && data.latestMessage.content.length > 35;

  const dateObject = new Date(data.updatedAt);

  return (
    <div
      style={{ backgroundColor: data._id === 'selectedChatId' ? '#F3F4F6' : undefined }} // Thay 'selectedChatId' bằng logic của bạn nếu cần
      onClick={() => select(data)}
      className="flex flex-row items-center justify-between rounded-md cursor-pointer mx-[2%] my-[5%] hover:bg-gray-100 px-[5%] py-[2%]"
    >
      <div className="flex flex-row items-center">
        <Avatar
          alt="User-pic"
          style={{
            width: '48px', // Default width
            height: '48px', // Default height
          }}
          src={
            isGroupChat
              ? groupLogo
              : user.pic?.startsWith('user')
              ? `${process.env.REACT_APP_API_URL}/${user.pic}`
              : user.pic
          }
        />
        <div className="flex flex-col ml-2">
          <div className="font-bold font-Roboto text-sm">{user.name}</div>
          <div className="text-xs text-[#979797]">
            {latestMessage}
            {isExcedding ? '.....' : ''}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-xs max-[800px]:hidden font-medium cursor-pointer text-[#979797]">
          {`${String(dateObject.getHours() % 12 || 12).padStart(2, '0')}:${String(
            dateObject.getMinutes()
          ).padStart(2, '0')} ${dateObject.getHours() >= 12 ? 'PM' : 'AM'}`}
        </div>
        <div className="mt-1">{data.notify && <Badge>1</Badge>}</div>
      </div>
    </div>
  );
}
