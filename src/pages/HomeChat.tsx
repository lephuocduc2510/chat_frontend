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
import { SignalRProvider, useSignalR } from "../context/SignalRContext";
import { useRoomContext } from "../context/RoomContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setIsCreatingRoomm, updateChat } from "../redux/Chat/chatSlice";
import { useAppDispatch } from "../redux/User/hook";
import { addMessage } from "../redux/Chat/chatLatestSlice";
import { updateRoom } from "../redux/Chat/roomSlice";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }, // Thời gian chuyển đổi
};
// Định nghĩa kiểu cho các state và props
interface User {
  _id: string;
  name: string;
  pic: string;
}

interface Chat {
  idRooms: string;
  roomName: string;
  latestMessage?: { content: string };
  createdDate: string;
  notify?: boolean;
  isActive: boolean;
  groupLogo?: string
  description?: string;
  users: User[];
}


const HomeChat: React.FC = () => {
  const dispatch = useDispatch();
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
  const checkCreateRoom = useSelector((state: RootState) => state.chat.isCreatingRoom);
  const { connection } = useSignalR();
  const userId =  JSON.parse(localStorage.getItem("info") || "{}").id;


  //received message
//   useEffect(() => {
//     console.log("Connection: ", connection);
//     if (connection) {
//       connection.on("ReceiveMessage", (messageData) => {
//         console.log("Message received globally: ", messageData);
  
//         // Cập nhật tin nhắn vào Redux hoặc state
//         dispatch(updateChat(messageData));
//         const newMessage = {
//           content: messageData.content,
//           userId: messageData.userId,
//           sentAt: messageData.sentAt,
//           fileUrl: messageData.fileUrl,
//           roomId: messageData.roomId,
//         };
//         dispatch(updateRoom(messageData.roomId));
//         dispatch(addMessage(newMessage));
//       });
  
//       // Cleanup listener khi component unmount
//       return () => {
//         connection.off("ReceiveMessage");
//       };
//     }
//   },  [dispatch]);

//   useEffect(() => {
//   if (connection && userId) {
//     chats.forEach(chat => {
//       connection.invoke("JoinRoom", chat.idRooms, userId)
//         .then(() => console.log(`Joined Room ${chat.idRooms}`)
      
      
//       )
//         .catch(err => console.error(`Error joining room ${chat.idRooms}: `, err));
//     });
//   }
// }, [connection, chats, userId])





  const getRoomsChat = async () => {
    setIsLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    try {
      const response = await axiosClient.get("/api/Rooms-User/get-rooms-by-user", config);
      setChats(response.data.result || []);
      setIsEmpty(response.data.result.length === 0);
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
      <SignalRProvider>
        <BasicModal handleClose={handleClose} open={open} />
        <ChatDetails closeChat={() => setChatModel(false)} chatModel={chatModel} />
        <TopBar createGroup={handleOpen} />
        <div className="flex flex-row items-center border-[1px] border-[#f5f5f5]">
          <ChatTitle openChatModel={() => setChatModel(true)}  idRooms= {roomId} roomName= {roomName} />
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
      </SignalRProvider>
    </div>
  );
};

export default HomeChat;
