import React, { useState } from "react";
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

interface LatestMessage {
  content: string;
}

interface Chat {
  _id: string;
  isGroupChat: boolean;
  chatName?: string;
  users: User[];
  latestMessage?: LatestMessage;
  updatedAt: string;
  notify?: boolean;
}


const HomeChat: React.FC = () => {
  const [chatModel, setChatModel] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Giả lập dữ liệu chats
  const state: Chat[] = [
    {
      _id: "1",
      isGroupChat: false,
      chatName: "Chat 1",
      users: [
        { _id: "1", name: "User 1", pic: "/path/to/pic1.jpg" },
        { _id: "2", name: "User 2", pic: "/path/to/pic2.jpg" }
      ],
      latestMessage: { content: "Hello, how are you?" },
      updatedAt: "2024-11-24T12:34:56Z",
      notify: true
    },
    {
      _id: "2",
      isGroupChat: true,
      chatName: "Group Chat",
      users: [
        { _id: "3", name: "User 3", pic: "/path/to/pic3.jpg" },
        { _id: "4", name: "User 4", pic: "/path/to/pic4.jpg" }
      ],
      latestMessage: { content: "Group chat started" },
      updatedAt: "2024-11-23T11:30:00Z"
    },
    {
      _id: "3",
      isGroupChat: false,
      chatName: "Chat 3",
      users: [
        { _id: "5", name: "User 5", pic: "/path/to/pic5.jpg" }
      ],
      latestMessage: { content: "Good morning!" },
      updatedAt: "2024-11-24T10:00:00Z",
      notify: true
    }
  ];

  return (
    <div className="grid max-[1250px]:w-[82vw] max-[1024px]:w-[92vw] max-[1250px]:grid-cols-[4.5fr,7fr] max-[900px]:grid-cols-[5.5fr,7fr] w-[80vw] relative grid-rows-[1fr,7fr] grid-cols-[3.5fr,7fr]">
      <BasicModal handleClose={handleClose} open={open} />
      <ChatDetails closeChat={() => setChatModel(false)} chatModel={chatModel} />
      <TopBar createGroup={handleOpen} />
      <div className="flex flex-row items-center border-[1px] border-[#f5f5f5]">
        <ChatTitle openChatModel={() => setChatModel(true)} />
      </div>
      <div className="border-[1px] overflow-y-scroll no-scrollbar border-[#f5f5f5]">
        {isLoading && <Loading />}
        {!isLoading &&
          state &&
          state.map((data, index) => (
            <motion.div
            key={index}
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <ChatBar select={() => {}} data={data} />
          </motion.div>
          ))}
        {isEmpty === true && state.length === 0 && <NoChats />}
      </div>
      <div className="bg-[#F6F8FC] flex flex-col relative overflow-hidden">
        <ChatMessages />
        <Type />
      </div>
    </div>
  );
};

export default HomeChat;
