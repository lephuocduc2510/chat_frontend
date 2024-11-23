import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { ToastContainer, toast } from "react-toastify";

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

const ChatDetails: React.FC<ChatDetailsProps> = ({ chatModel, closeChat }) => {
  const [Results, setResults] = useState<any[]>([]);
  const [isEmptyResults, setIsEmptyResults] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      <ToastContainer />
      <Modal
        open={chatModel}
        onClose={closeChat}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="text-2xl font-Poppins">Info</div>
          <div className="flex w-[100%]">
            <input
              disabled
              spellCheck="false"
              placeholder="Chat Name"
              className="text-lg h-[16%] w-[100%] mt-5 font-thin px-1 py-2 outline-none bg-[#F6F8FC]"
            />
          </div>
          <div className="flex w-[100%] mt-3 justify-between items-center">
            <button
              className="bg-red-400 px-2 py-1 rounded-sm text-white text-lg"
            >
              Delete Group
            </button>
            <CancelIcon
              sx={{ fontSize: "30px", cursor: "pointer" }}
              onClick={closeModelHandler}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ChatDetails;
