import React from "react";
import { Avatar } from "@mui/material";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import groupLogo from '../../assets/images/group.png';
import { useSelector } from "react-redux";

// Xoá activeChat khỏi props
interface ChatTitleProps {
  openChatModel: () => void;
  idRooms: string;
  roomName: string;
}

const ChatTitle: React.FC<ChatTitleProps> = ({ openChatModel,  idRooms, roomName }) => {

  const activeRoom = useSelector((state: any) => state.chat.updateActive);
  const idRoom = useSelector((state: any) => state.chat.selectedChatId);


  if (idRoom === null) return <></>;
  return (

    <div className="flex flex-row items-center px-[5%] box-border justify-between w-[100%]">
      <div className="flex flex-row items-center">
        <Avatar
          alt="Group Logo"
          src={groupLogo}
          style={{
            width: '48px',
            height: '48px',
          }}
        />
        <div className="flex flex-col ml-3">
          <div className="text-xl font-Roboto font-semibold">  {roomName? roomName : "Group Name"}  </div>
        </div>
      </div>
      <div onClick={openChatModel}>
        <MoreHorizOutlinedIcon
          style={{ cursor: "pointer" }}
          color="action"
        />
      </div>
    </div>
  );
};

export default ChatTitle;
