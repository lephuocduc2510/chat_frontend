import * as React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { axiosClient } from "../../libraries/axiosClient";
import User from "./User";
import { FaChevronDown, FaPlug, FaPlus } from "react-icons/fa";
import GroupUserList from "./GroupUserList";
import GroupUserDetails from "./GroupUserInDetails";
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import { PersonAdd } from "@mui/icons-material";
import { selectChat, updateRoomDeleted } from "../../redux/Chat/chatSlice";
import AddUserToRoom from "./AddUserToRoom";
import PinnedMessages from "./PinMessages";

const style = {

  position: "absolute",
  top: "50%",
  left: "50%",
  width: window.innerWidth / 3,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "14px",
  p: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",  // Căn giữa nội dung theo chiều ngang
  flexDirection: "column",
  outline: "none",
  maxWidth: "700px", // Giới hạn chiều rộng
  maxHeight: "850px", // Giới hạn chiều cao để không vượt quá viewport
  overflowY: "auto",
  marginTop: "-23%",  // Căn giữa theo chiều dọc
  marginLeft: "-15%", // Điều chỉnh theo chiều ngang (có thể thay đổi giá trị này)

};

interface ChatDetailsProps {
  chatModel: boolean;
  closeChat: () => void;
}

interface User {
  id: string;
  name: string;
  imageUrl: string;
  userName: string;
  role: string;
}

const ChatDetails: React.FC<ChatDetailsProps> = ({ chatModel, closeChat }) => {
  const [Results, setResults] = useState<any[]>([]);
  const [isEmptyResults, setIsEmptyResults] = useState<boolean>(false);
  const [users, setUsers] = React.useState<User[]>([]);
  const [groupUsers, setGroupUsers] = React.useState<User[]>([]);
  const idRoom = useSelector((state: RootState) => state.chat.selectedChatId);
  const roomName = useSelector((state: RootState) => state.chat.nameRoom);
  const [isModalConfirm, setIsModalConfirm] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [isMod, setIsMod] = useState(false);
  const cookie = localStorage.getItem("token");
  const [pinnedMessages, setPinnedMessages] = React.useState<PinnedMessage[]>([]);
  const [isPinnedDropdownOpen, setIsPinnedDropdownOpen] = React.useState<boolean>(true);
  const dispatch = useDispatch();

  const openModal = () => {
    setIsModalConfirm(true);
  };

  const closeModal = () => {
    setIsModalConfirm(false);
  };
  interface PinnedMessage {
    messageId: string;
    content: string;
    sentAt: string;
    user: {
      name: string;
      imageUrl: string;
    };
  }

  // Hàm hiển thị component AddUserToRoom
  const handleAddUserClick = () => {
    setShowAddUser(true);
  };

  // Hàm quay lại giao diện trước
  const handleBack = () => {
    setShowAddUser(false);
  };


  const notify = (errorname: string, value?: string) => {
    if (errorname === "error") {
      return toast.error(`${value}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    return toast.error(`${errorname}`, {
      position: "top-center",
      autoClose: 2222,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const closeModelHandler = () => {
    setResults([]);
    closeChat();
  };
  // Fetch pinned messages
  const getPinnedMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axiosClient.get(`/api/Messages/room/${idRoom}/pinned-messages`, config);

      console.log("API Response:", response.data.result); // Debug dữ liệu trả về từ API

      setPinnedMessages(response.data.result || []);
    } catch (error) {
      console.error("Error fetching pinned messages:", error);
    }
  };


  React.useEffect(() => {
    if (cookie !== null) {
      const role = JSON.parse(atob(cookie.split('.')[1])).role;
      if (role === 'mod') {
        setIsMod(true);
      } else {
        setIsMod(false);
      }
    }
  }
    , [chatModel, showAddUser]);


  React.useEffect(() => {
    if (idRoom !== null && chatModel === true) {
      getUser();
      dispatch(updateRoomDeleted(idRoom));
    }
  },
    [chatModel, showAddUser]);

  // Gọi API khi chatModel mở
  React.useEffect(() => {
    if (chatModel && idRoom) {
      getPinnedMessages();
    }
  }, [chatModel, idRoom]);

  //////////////////// Get user ///////////////////////
  const getUser = async () => {

    const config = {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    };
    const response = await axiosClient.get(`/api/Rooms-User/${idRoom}`, config);
    const user = response.data.result;
    setUsers(user);
  };
  //////////////////// Remove user ///////////////////////
  const handleRemoveUser = async (userId: string) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const idUser = [userId];
    const data = {
      idRooms: idRoom,
      idUser
    };
    const response = await axiosClient.delete("/api/Rooms-User/remove-user-out-room", { data, ...config });
    if (response.status === 200) {
      getUser();
      notify("User removed successfully");
    } else {
      notify("error", "Error removing user");
    }
  };

  //////////////////// Delete chat ///////////////////////
  const handleDeleteChat = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosClient.delete(`/api/rooms/${idRoom}`, config);
    if (response.status === 204) {
      notify("Chat deleted successfully");
      closeModal();
      closeModelHandler();
      dispatch(updateRoomDeleted(''));
    } else {
      notify("error", "Error deleting chat");
    }
  };




  return (
    <div className="absolute max-h-500 overflow-y-auto">
      <Modal open={chatModel} onClose={closeChat} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          sx={style}>
          <div className="text-2xl font-Poppins">Chi tiết phòng</div>
          <div className="flex w-full justify-center mt-5">
            <input
              defaultValue={roomName}
              disabled
              spellCheck="false"
              placeholder="Chat Name"
              className="text-2xl h-[50px] w-[80%] font-thin px-3 py-2 outline-none bg-[#F6F8FC] text-center rounded-lg shadow-sm"
            />
          </div>


          {/* // User in room */}
          <div className="p-6 w-[100%] max-w-lg mx-auto bg-white rounded-lg shadow-md mt-10">

          {/* List users in room */}
<!--            <div className="p-6 w-[100%] max-w-lg mx-auto bg-white rounded-lg shadow-md mt-6"> {/* Giảm margin-top từ 10 xuống 6 */} --> -->

            <label
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex justify-between items-center text-base px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <span>List user in room</span>
              <FaChevronDown
                className={`transform transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
              />
            </label>
            {isDropdownOpen && (
              <div className="mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg shadow-inner bg-gray-50">
                {users.length ? (
                  users.map((user) => (
                    <div key={user.id} className="px-4 py-2 hover:bg-blue-100">
                      <GroupUserDetails
                        values={{
                          id: user.id,
                          pic: user.imageUrl,
                          name: user.name,
                          email: user.userName,
                          role: user.role,
                        }}
                        add={() => { }}
                        remove={(user) => {
                          handleRemoveUser(user.id);
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="mt-5 px-4 py-2 text-gray-500 text-sm">No users found</div>
                )}
              </div>
            )}
            </div>

            <div>
              {!showAddUser ? (
                // Hiển thị giao diện nút Add User
                isMod ? (
                  <div
                    className="px-5 py-3 hover:bg-blue-100 cursor-pointer flex items-center justify-start mt-2"
                    onClick={handleAddUserClick}
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-100 hover:bg-blue-200">
                      <FaPlus className="text-blue-500" size={15} />
                    </div>
                    <span className="ml-2 text-blue-500">Add User</span>
                  </div>
                ) : null
              ) : (
                // Hiển thị component AddUserToRoom
                <AddUserToRoom onBack={handleBack} />
              )}
            </div>

  
            {/* <div className="px-5 py-3 hover:bg-blue-100 cursor-pointer flex items-center justify-start mt-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-100 hover:bg-blue-200">
                <FaPlus className="text-blue-500" size={15} />
              </div>
              <span className="ml-2 text-blue-500">Add User</span>
            </div> */}
          </div>
  
          {/* Pinned Messages */}
          <div className="p-6 w-[100%] max-w-lg mx-auto bg-white rounded-lg shadow-md mt-4"> {/* Giảm margin-top từ 10 xuống 4 */}
            <label
              onClick={() => setIsPinnedDropdownOpen(!isPinnedDropdownOpen)}
              className="flex justify-between items-center text-base px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <span>Pinned Messages</span>
              <FaChevronDown
                className={`transform transition-transform duration-300 ${isPinnedDropdownOpen ? "rotate-180" : "rotate-0"}`}
              />
            </label>
            {isPinnedDropdownOpen && (
              <div className="mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg shadow-inner bg-gray-50">
                {pinnedMessages.length > 0 ? (
                  pinnedMessages.map((message) => (
                    <div key={message.messageId} className="p-3 mb-2 bg-gray-100 rounded-md shadow-sm">
                      <PinnedMessages
                        values={{
                          content: message.content,
                          name: message.user.name,
                          sentAt: new Date(message.sentAt).toLocaleString(),
                          pic: message.user.imageUrl,
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <Typography variant="body2" className="text-gray-500">
                    No pinned messages.
                  </Typography>
                )}
              </div>
            )}
          </div>
  
          <div className="mt-10">
            <button
              className="text-[#0147FF] text-xl border-[2px] border-[#0147FF] px-4 py-1 ml-2 mt-4 rounded-lg"
              onClick={closeModelHandler}
            >
              Cancel
            </button>


            {/* Xoá phòng chat */}
            {isMod ?
              (<button className="bg-[#EF5350] text-white text-lg ml-2 px-2 py-1.5 mt-4 rounded-lg" onClick={openModal}>

                <DeleteIcon className="mr-2"></DeleteIcon>
                Delete Chat
              </button>) : null
            }
            <Modal
              open={isModalConfirm}
              onClose={closeModal}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 300,
                  bgcolor: "background.paper",
                  borderRadius: "8px",
                  boxShadow: 24,
                  p: 3,
                }}
              >
                <Typography id="modal-title" variant="h6" component="h2">
                  Confirm Delete
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2 }}>
                  Are you sure you want to delete this chat?
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <Button variant="outlined" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      console.log("Deleted");
                      handleDeleteChat();

                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Modal>


<!--             <button
              className="bg-[#EF5350] text-white text-lg ml-2 px-2 py-1.5 mt-4 rounded-lg"
              onClick={openModal}
            >
              <DeleteIcon className="mr-2"></DeleteIcon>
              Delete Chat
            </button> -->

          </div>
        </Box>
      </Modal>
    </div>
  );
  
};

export default ChatDetails;
