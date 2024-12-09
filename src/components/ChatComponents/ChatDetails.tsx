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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: window.innerWidth / 3,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "14px",
  p: 4,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  outline: "none",
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = React.useState<User[]>([]);
  const [groupUsers, setGroupUsers] = React.useState<User[]>([]);
  const idRoom = useSelector((state: RootState) => state.chat.selectedChatId);
  const [isModalConfirm, setIsModalConfirm] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const dispatch = useDispatch();

  const openModal = () => {
    setIsModalConfirm(true);
  };

  const closeModal = () => {
    setIsModalConfirm(false);
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


  React.useEffect(() => {
    if (idRoom !== null && chatModel === true) {
      getUser();
      dispatch(updateRoomDeleted(idRoom));
    }
  },
    [chatModel]);

  //////////////////// Get user ///////////////////////
  const getUser = async () => {
    const cookie = localStorage.getItem("token");
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

  //////////////////// Add user ///////////////////////

  const searchHandler = async (value: string) => {
    setIsLoading(true);
    const cookie = localStorage.getItem("jwt");
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/users?search=${value}`,
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      }
    );

    setIsLoading(false);
    const data = await response.json();
    data.users.length = data.users.length > 2 ? (data.users.length = 2) : data.users.length;
    setResults(data.users);
    if (data.users.length === 0) setIsEmptyResults(true);
    else setIsEmptyResults(false);
  };

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      searchHandler(e.target.value);
    }, 2000);
  };

  return (
    <div className="absolute">
      <Modal open={chatModel} onClose={closeChat} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="text-2xl font-Poppins">Room Setting</div>
          <div className="flex w-[100%]">
            <input
              defaultValue={"Chat Name"}
              disabled
              spellCheck="false"
              placeholder="Chat Name"
              className="text-lg h-[16%] w-[100%] mt-5 font-thin px-1 py-2 outline-none bg-[#F6F8FC]"
            ></input>
            <button className="bg-[#014DFE] text-white text-lg ml-2 px-2 py-1 mt-4 rounded-sm">Change</button>
          </div>
          {/* // User in room */}
          <div className="p-6 w-[100%] max-w-lg mx-auto bg-white rounded-lg shadow-md mt-10">
            <label
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex justify-between items-center text-base px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <span>List user in room</span>
              <FaChevronDown
                className={`transform transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} // Hiệu ứng xoay icon
              />
            </label>
            {isDropdownOpen && (
              <div className="mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg shadow-inner bg-gray-50">
                {users.length ? (
                  users.map((user) => (
                    <div key={user.id} className="px-4 py-2 hover:bg-blue-100">
                      <GroupUserDetails
                        values={{ id: user.id, pic: user.imageUrl, name: user.name, email: user.userName, role: user.role }}
                        add={() => { }}
                        remove={(user) => { handleRemoveUser(user.id) }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="mt-5 px-4 py-2 text-gray-500 text-sm">No users found</div>
                )}
              </div>
            )}

            <div
              className="px-5 py-3 hover:bg-blue-100 cursor-pointer flex items-center justify-start mt-2"
            // onClick={addUserHandler} // Gọi hàm thêm người dùng khi nhấn vào dấu cộng
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-100 hover:bg-blue-200">
                <FaPlus className="text-blue-500" size={15} /> {/* Biểu tượng dấu cộng */}
              </div>
              <span className="ml-2 text-blue-500">Add User</span> {/* Văn bản "Add User" */}
            </div>
          </div>

          {/* Phần tử "Add User" */}
          {/* <motion.div
            className="flex flex-row items-center mt-4 p-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          // onClick={clickHandler} // Xử lý sự kiện khi nhấn "Add User"
          >
            <PersonAdd style={{ fontSize: '24px' }} />
            <div className="ml-2 font-semibold">Add User</div> 
          </motion.div> */}


          <div className="mt-10">


            <button className="text-[#0147FF] text-xl border-[2px] border-[#0147FF] px-4 py-1 ml-2 mt-4 rounded-lg" onClick={closeModelHandler}>
              Cancel
            </button>

            {/* Xoá phòng chat */}
            <button className="bg-[#EF5350] text-white text-lg ml-2 px-2 py-1.5 mt-4 rounded-lg" onClick={openModal}>
              <DeleteIcon className="mr-2"></DeleteIcon>
              Delete Chat
            </button>
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

          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ChatDetails;
