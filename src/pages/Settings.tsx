import React, { useState } from "react";
import Profile from "../components/SettingsComponents/Profile";
import InputName from "../components/SettingsComponents/InputName";
import InputEmail from "../components/SettingsComponents/InputEmail";
import InfoIcon from '@mui/icons-material/Info';
import { notification } from "antd";
import axios from "axios";
import { axiosClient } from "../libraries/axiosClient";
import InputPhone from "../components/SettingsComponents/InputPhone";
import { click } from "@testing-library/user-event/dist/click";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/User/userSlice";

export default function Settings() {
  const dispatch = useDispatch();
  const storedData = JSON.parse(localStorage.getItem('info') || '{}');
  const [name, setName] = useState(storedData.name);
  const [email, setEmail] = useState(storedData.userName);
  const [phoneNumber, setPhoneNumber] = useState(storedData.phoneNumber);
  const [clicked, setClicked] = useState(false);


  const updateHandler = () => {

    setClicked(true);

    // Reset màu sau 1 giây (1000ms)
    setTimeout(() => {
      setClicked(false);
    }, 1000);

    const formData = new FormData();
    const token = localStorage.getItem("token");
    if (name) formData.append("Name", name);
    if (phoneNumber) formData.append("phoneNumber", phoneNumber);

    const updateData = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await axiosClient.put("/api/user/change-profile", formData, config);
      if (response.status === 200) {


        const updatedUserInfo = {
          id: response.data.result.id,
          name: response.data.result.name,
          email: response.data.result.userName, // có thể bạn cần thay đổi trường này nếu `email` là đúng
          imageUrl: response.data.result.imageUrl,
        };
        dispatch(setUserInfo(updatedUserInfo));
        notification.success({
          message: 'Successfully saved',
          description: 'Your data has been saved successfully.',
          duration: 2, // Thời gian hiển thị (2 giây)
          placement: 'top', // Vị trí thông báo
          onClose: () => {
            console.log('Notification closed');
          },
        });

      }

      else
        notification.error({
          message: 'Operation failed',  // Tiêu đề thông báo lỗi
          description: 'An error occurred while saving your data. Please try again later.',  // Nội dung thông báo lỗi
          duration: 3,  // Thời gian hiển thị (3 giây)
          placement: 'topRight',  // Vị trí thông báo
          onClose: () => {
            console.log('Error notification closed');
          },
        });
    };

    updateData();

  };


  return (
    <div className="grid grid-cols-[40%_60%] w-[80vw] mx-auto gap-4">
      {/* Phần bên trái (40%) */}
      <div className="relative grid-rows-[1fr_7fr] mt-28 ms-4">
        <div className="font-Poppins text-xl font-semibold mb-4">
          Public profile
        </div>
        <div className="flex items-center mb-4">
          <InfoIcon sx={{ fontSize: 15 }} color="info" />
          <div className="font-Poppins text-sm ml-2">
            To update your profile picture, select an image and upload it.
          </div>
        </div>
        <Profile />
        <div className="mt-6 flex flex-col gap-6">
          <InputName name={name} setName={(value) => setName(value)} />
          <InputEmail email={email} setEmail={(value) => setEmail(value)} />
          <InputPhone phone={phoneNumber} setPhone={(value) => setPhoneNumber(value)} />
        </div>
        <div className="flex flex-row mt-6 gap-4">
          <div
            style={{
              backgroundColor: clicked ? "#872030" : "#202142", // Màu thay đổi khi click
            }}
            onClick={updateHandler}
            className="bg-[#202142] hover:bg-[#202162] text-white font-medium cursor-pointer px-4 py-2 text-sm rounded-md"
          >
            Update
          </div>
          <div className="bg-[#C6CED1] text-black font-medium cursor-pointer px-4 py-2 text-sm rounded-md">
            Reset
          </div>
        </div>
      </div>

      {/* Phần bên phải (60%) - Banner về chat */}
      <div className="relative bg-gradient-to-r from-[#4c6ef5] to-[#7390f7] rounded-2xl overflow-hidden h-screen">
        <div className="absolute inset-0 flex justify-center items-center text-white text-3xl font-bold z-10">
          <div className="text-center ms-16">
            <h2 className="text-4xl">Chat with Us</h2>
            <p className="mt-2 text-lg">Your personalized chat experience awaits!</p>
          </div>
        </div>

        {/* Tấm banner với hình nền đẹp và hiệu ứng mờ */}
        <img
          src=""
          alt="Chat Banner"
          className="object-contain object-right w-full h-full transition-opacity duration-500 hover:opacity-90 p-1"
        />
      </div>
    </div>

  );
}
