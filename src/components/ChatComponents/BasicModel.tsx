import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import GroupUserList from "./GroupUserList";
import User from "./User";
import Loading from "./Loading";

interface User {
  _id: string;
  name: string;
  email: string;
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
  return (
    <div className="absolute">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="text-2xl font-Poppins">Create a group Chat</div>
          <input
            spellCheck="false"
            placeholder="Chat Name"
            className="text-lg h-[16%] w-[100%] mt-5 font-thin px-1 py-2 outline-none bg-[#F6F8FC]"
          />
          <input
            spellCheck="false"
            placeholder="Add your Friends"
            className="text-lg h-[16%] w-[100%] px-1 py-2 mt-3 outline-none font-thin bg-[#F6F8FC]"
          />
          <div className="w-[100%]">
            {/* Giả lập dữ liệu tìm kiếm, có thể thay thế bằng dữ liệu thực tế */}
            <User add={() => {}} values={{ pic: "1", name: "John Doe", email: "john@example.com" }} />
            {/* Hoặc có thể hiển thị Loading khi dữ liệu đang tải */}
            <Loading />
          </div>
          {/* Danh sách người dùng đã chọn */}
          <GroupUserList remove={() => {}} users={[{ _id: "1", name: "John Doe", pic: "john@example.com" }]} />
          <div>
            <button className="bg-[#0147FF] text-white text-xl px-4 py-2 mt-4 rounded-lg">
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
