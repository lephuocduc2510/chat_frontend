import React, { useContext, useEffect, useState } from "react";
import TopBar from "../components/ChatComponents/TopBar";
import ChatBar from "../components/ChatComponents/ChatBar";
import ChatTitle from "../components/ChatComponents/ChatTitle";
import ChatMessages from "../components/ChatComponents/ChatMessages";
import Type from "../components/ChatComponents/Type";
import BasicModal from "../components/ChatComponents/BasicModel";
import ChatDetails from "../components/ChatComponents/ChatDetails";
import Loading from "./util/Loading";
import NoChats from "./util/NoChats";
import { motion } from 'framer-motion';
import { axiosClient } from "../libraries/axiosClient";
import { set } from "date-fns";
import { useRoomContext } from "../context/RoomContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setIsCreatingRoomm, updateChat } from "../redux/Chat/chatSlice";
import { useAppDispatch } from "../redux/User/hook";
import { addMessage } from "../redux/Chat/chatLatestSlice";
import { updateRoom } from "../redux/Chat/roomSlice";
import { SocketProvider, useSocket } from "../context/SocketContext";
import { avatarClasses } from "@mui/material";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }, // Thời gian chuyển đổi
};
// Định nghĩa kiểu cho các state và props
interface User {
  _id: string;
  name: string;
  avatar: string;
}

interface Chat {
  roomId: string;
  name: string;
  lastMessage?: string
  sendAt: string
  createdDate: string;
  notify?: boolean;
  isActive: boolean;
  groupLogo?: string
  description?: string;
  senderId: string;
  senderName: string;
  users: User[];
}


const HomeChat: React.FC = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const [chatModel, setChatModel] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [roomSelected, setRoomSelected] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const isCreatingRoom = useRoomContext();
  const roomIdDeleted = useSelector((state: RootState) => state.chat.roomDelete) || "";
  const roomId = useSelector((state: RootState) => state.chat.selectedChatId) || "";
  const roomName = useSelector((state: RootState) => state.chat.nameRoom) || "";
  const groupLogo = useSelector((state: RootState) => state.rooms.groupLogo) || "";
  const checkCreateRoom = useSelector((state: RootState) => state.chat.isCreatingRoom);
  const userId = JSON.parse(localStorage.getItem("info") || "{}").id;
  const user = JSON.parse(localStorage.getItem("info") || "{}");
  const latestChat = useSelector((state: RootState) => state.chatLatest) || "";



  // useEffect(() => {
  //   // Lắng nghe sự kiện `new-message`
  //   if (socket) {
  //     socket.on("server-message", (data) => {
  //       if (data.type === 'chat') {
  //         console.log("🚀 New message received to homechat:", data);

  //         // Gửi tin nhắn vào Redux store
  //         const newMessage = {
  //           userId: data.idUser,
  //           content: data.message,
  //           fileUrl: data.fileUrl,
  //           sentAt: data.timeStamp,
  //           roomId: data.roomId,
  //           avatar: data.avatar,
  //         };
  //         dispatch(addMessage(newMessage));
  //       }
  //     });


  //     // Dọn dẹp kết nối khi component unmount
  //     return () => {
  //       socket.off("server-message");
  //     };

  //   }
  // }, [dispatch]);
  
 



  const getRoomsChat = async () => {
    setIsLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      const response = await axiosClient.get(`/rooms-user/user/${userId}`, config);
      const rooms = response.data.result || [];
      setChats(response.data.result || []);
      setIsEmpty(response.data.result.length === 0);
      // Join all rooms after fetching
      if (socket && rooms.length > 0) {
        const roomIds = rooms.map((room: Chat) => room.roomId);
        socket.emit('client-message', { type: 'join', rooms: roomIds, userId: userId, name: user.name });
        console.log('Joined rooms:', roomIds);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {

    getRoomsChat();
  }, [roomIdDeleted]);






  return (

    <div className="grid max-[1250px]:w-[82vw] max-[1024px]:w-[92vw] max-[1250px]:grid-cols-[4.5fr,7fr] max-[900px]:grid-cols-[5.5fr,7fr] w-[80vw] relative grid-rows-[1fr,7fr] grid-cols-[3.5fr,7fr]">
      <BasicModal handleClose={handleClose} open={open} />
      <ChatDetails closeChat={() => setChatModel(false)} chatModel={chatModel} />
      <TopBar createGroup={handleOpen} />
      <div className="flex flex-row items-center border-[1px] border-[#f5f5f5]">
        <ChatTitle openChatModel={() => setChatModel(true)} idRooms={roomId} roomName={roomName} groupLogo={groupLogo} />
      </div>
      <div className="border-[1px] overflow-y-scroll no-scrollbar border-[#f5f5f5]">
        {isLoading && <Loading />}
        {!isLoading &&
          chats &&
          chats.map((data, index) => (
            <motion.div
              key={index}
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <ChatBar select={(value) => {
                console.log(value);
                console.log(value.latestMessage);
                setRoomSelected(value._id);
              }} data={data} />
            </motion.div>
          ))}
        {isEmpty === true && chats.length === 0 && <NoChats />}
      </div>
      <div className="bg-[#F6F8FC] flex flex-col relative overflow-hidden">
        <ChatMessages />
        <Type />
      </div>
    </div>

  );
};

export default HomeChat;
