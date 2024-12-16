import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import GroupUserList from "./GroupUserList";
import User from "./User";
import Loading from "./Loading";
import { axiosClient } from "../../libraries/axiosClient";
import 'antd/dist/reset.css';
import { useRoomContext } from "../../context/RoomContext";
import { useAppDispatch } from "../../redux/User/hook";
import { setIsCreatingRoomm } from "../../redux/Chat/chatSlice";


interface User {
  id: string;
  fullname: string;
  avatar: string;
  email: string;
}

interface FormData {
  name: string;
  friends: [];
  description: string,
}

interface BasicModalProps {
  handleClose: () => void;
  open: boolean;
}

const style = {
  position: "absolute" as const,
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

const BasicModal: React.FC<BasicModalProps> = ({ handleClose, open }) => {
  const storedData = JSON.parse(localStorage.getItem('info') || '{}');
  const idUser = storedData.id;
  const [formData, setFormData] = React.useState<FormData>({ name: "", friends: [], description: "", });
  const [roomName, setRoomName] = React.useState<FormData>();
  const [idRoom, setIdRoom] = React.useState<string>("");
  const [users, setUsers] = React.useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = React.useState<User[]>([]);
  const [groupUsers, setGroupUsers] = React.useState<User[]>([{ id: idUser, fullname: storedData.fullname, avatar: storedData.avatar, email: storedData.email }]);
  const [searchTerm, setSearchTerm] = React.useState(""); // Từ khóa tìm kiếm
  const [checkSent, setCheckSent] = React.useState(false);
  const isFirstRender = React.useRef(true); // Biến đánh dấu lần render đầu tiên
  const { isCreatingRoom, setIsCreatingRoom } = useRoomContext(); 
  const dispatch = useAppDispatch();

  // Hàm xử lý khi input thay đổi
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Cập nhật giá trị theo name
    }));
  };

  const getUser = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosClient.get("/users", config);
    if (response.status === 200) {
      setUsers(response.data);
    }
  }

  React.useEffect(() => {
    getUser();
  }, []);

  // Lọc người dùng khi nhập vào ô tìm kiếm
  React.useEffect(() => {
    if(searchTerm === "") {
      return ;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter(
        (user) =>
          !groupUsers.find((groupUser) => groupUser.id === user.id) &&
          user.fullname.toLowerCase().includes(lowerSearchTerm)
      )
    );
  }, [searchTerm, users, groupUsers]);


  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // Đánh dấu là đã qua lần render đầu tiên
      return;
    }
  
    if (idRoom) {
      addUsersToRoom();
      //reset input and groupUsers
      setGroupUsers([]);
      setFormData({ name: "", friends: [], description: "", });

    }
  }, [idRoom, checkSent]);

   

  const HandleCreateRoom = async () => {
    // setIsCreatingRoom(true);
    // dispatch(setIsCreatingRoomm(true));
    const token = localStorage.getItem("token");
    const createdBy = idUser;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const body = {
      name: formData.name,
      description: formData.description,
      createdBy
    };
    const response = await axiosClient.post("/rooms", body, config);
    if (response.status === 200) {
      setIdRoom(response.data.id);
      handleClose();
      setCheckSent(false);
      // setIsCreatingRoom(false);
    }
    else {
      // setIsCreatingRoom(false);
      console.log("Error: ", response.data.message);
    }
  };

  // Add user to room
  const addUsersToRoom = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    console.log("Group users: ", groupUsers);
    const idUser = groupUsers.map((user) => user.id);
    console.log("Id room: ", idRoom);
    console.log("Id user: ", idUser);
    const data = {
      idRoom: idRoom,
      idUser: idUser,

    };
    console.log("Data: ", data);
    const response= await axiosClient.post("/rooms-user", data, config);
    if (response.status === 200) {
      console.log("Add user to room successfully");
    }

   
  }


  // Thêm người dùng vào nhóm
  const addUserToGroup = (user: User) => {
    setGroupUsers((prev) => [...prev, user]);
    setSearchTerm(""); // Xóa input tìm kiếm sau khi thêm
  };

  // Xóa người dùng khỏi nhóm
  const removeUserFromGroup = (userId: string) => {
    setGroupUsers((prev) => prev.filter((user) => user.id !== userId));
  };


  return (
    <div className="absolute">
      <Loading spinning={isCreatingRoom} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="text-2xl font-Poppins">Create a group Chat</div>
          <input
            name="name"
            type="text"
            spellCheck="false"
            placeholder="Group Name"
            value={formData.name}
            onChange={handleChange}
            className="text-lg h-[16%] w-[100%] mt-5 font-thin px-1 py-2 outline-none bg-[#F6F8FC]"
          />
         
          <textarea
            name="description"
            spellCheck="false"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="text-lg h-[16%] w-[100%] px-1 py-2 mt-3 outline-none font-thin bg-[#F6F8FC] resize-none"
            rows={4} // Số dòng hiển thị mặc định
          />
          {/* <div className="w-[100%]">
            <User add={() => { }} values={{ pic: "1", name: "John Doe", email: "john@example.com" }} />
          <Loading  spinning/>
          </div>
          <GroupUserList remove={() => { }} users={[{ id: "1", name: "John Doe", pic: "john@example.com" }]} /> */}

          {/* Danh sách người dùng */}
          <div className="p-6 w-[100%] max-w-lg mx-auto bg-white rounded-lg shadow-md mt-10">
            <input
              type="text"
              placeholder="Search for friends"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 mb-4"
            />
            <div className="mb-4">
              {filteredUsers.length && searchTerm !== ""  ? (
                filteredUsers.map((user) => (
                  <User
                    key={user.id}
                    values={{ avatar: user.avatar, name: user.fullname, email: user.email }}
                    add={() => addUserToGroup(user)}
                  />
                ))
              ) : (
                <div className="text-gray-500 text-sm">No users found</div>
              )}
            </div>
          </div>

          {/* Danh sách nhóm */}
          <div className="mb-4">
            <GroupUserList
              users={groupUsers.map((user) => ({
                id: user.id,
                name: user.fullname,
                avatar: user.avatar,  
              }))}
              remove={removeUserFromGroup}
            />
          </div>



          <div>
            <button onClick={HandleCreateRoom} className="bg-[#0147FF] text-white text-xl px-4 py-2 mt-4 rounded-lg">
              Create Chat
            </button>
            <button
              onClick={handleClose}
              className="text-[#0147FF] text-xl border-[2px] border-[#0147FF] px-4 py-1.5 ml-2 mt-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default BasicModal;
