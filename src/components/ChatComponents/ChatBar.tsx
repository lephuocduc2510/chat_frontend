import React from 'react';
import { Avatar } from '@mui/material';
import Badge from './util/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { selectChat } from '../../redux/Chat/chatSlice';
import { RootState } from '../../redux/store';
// Định nghĩa kiểu cho props
interface ChatBarProps {
  data: {
    idRooms: string;
    roomName?: string;
    latestMessage?: { content: string };
    createdDate: string;
    notify?: boolean;
    groupLogo? : string
    description?: string;
  };
  select: (data: any) => void; // Điều chỉnh kiểu nếu `select` có thể cụ thể hơn
}

export default function ChatBar({ data, select }: ChatBarProps) {
  const dispatch = useDispatch();
  const selectedChatId = useSelector((state: RootState) => state.chat.selectedChatId);
  const groupName = data.roomName || 'Group Chat'; // Tên nhóm mặc định
  const latestMessage = data.latestMessage ? data.latestMessage.content.slice(0, 35) : '';
  const isExcedding = data.latestMessage && data.latestMessage.content.length > 35;
  const groupImg =  data.groupLogo // Lấy ảnh đại diện của nhóm hoặc người dùng đầu tiên
  const dateObject = new Date(data.createdDate); // Chuyển đổi `updatedAt` thành đối tượng `Date`
  const description = data.description || 'No description'; // Mô tả mặc định
  

  
  const handleSelect = () => {
    // Dispatch action để thay đổi selectedChatId trong Redux khi phòng chat được chọn
    dispatch(selectChat(data.idRooms));
    select(data); // Gọi thêm hàm select từ props (nếu cần)
    console.log(data.idRooms);
  };

  return (
    <div
      style={{ backgroundColor: data.idRooms === 'selectedChatId' ? '#F3F4F6' : undefined }} // Thay 'selectedChatId' bằng logic của bạn nếu cần
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
            {description}
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
