import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { axiosClient } from "../../libraries/axiosClient";
import { Button, Layout, message, notification, Upload } from "antd";
import { Content } from "antd/es/layout/layout";
import { UploadFileOutlined } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../redux/User/hook";
import { setUserInfo, updateUserAvatar } from "../../redux/User/userSlice";

export default function Profile() {
  const dispatch = useAppDispatch();
  const dataredux = useAppSelector((state) => state.user.userInfo);
  const storedData = JSON.parse(localStorage.getItem('info') || '{}');
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [image, setImage] = React.useState(storedData.imageUrl);
  const [clicked, setClicked] = useState(false);
  const [saved, setSaved] = useState(false);
  
  useEffect(() => {
    console.log("Selected Image after update:", selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    if (dataredux && dataredux.imageUrl && dataredux.imageUrl !== image) {
        setImage(dataredux.imageUrl);
        console.log("Image after update by redux:", image);
    }

}, [dataredux,saved]);

  useEffect(() => {
    console.log("Image after update:", image);
  }
    , [image]);

  

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      setSelectedImage(file);
    };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files ? e.target.files[0] : null;
  //   console.log(storedData);
  //   if (file) {
  //     setSelectedImage(file);
  //     const reader = new FileReader();
  //     // reader.onloadend = () => {
  //     //   setImage(reader.result as string); // Lưu đường dẫn hình ảnh
  //     // };
  //     reader.readAsDataURL(file);
     
  //   }
  // };


  const handleUpload = async () => {
   
    setClicked(true);
    // Reset màu sau 1 giây (1000ms)
    setTimeout(() => {
      setClicked(false);
    }, 1000);

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    if (selectedImage) formData.append("Image", selectedImage);
    console.log(formData);
    const data = await axiosClient.put("/api/user/change-profile", formData, config);
    if (data.status === 200) {
      const updatedUserInfo = {
        id: data.data.result.id,
        name: data.data.result.name,
        email: data.data.result.userName, // có thể bạn cần thay đổi trường này nếu `email` là đúng
        imageUrl: data.data.result.imageUrl,
      };
      dispatch(setUserInfo(updatedUserInfo));
      setSaved(true);
      console.log("Saved:", dataredux);
      notification.success({
        message: 'Successfully saved',
        description: 'Your avatar has been saved.',
        duration: 2, // Thời gian hiển thị (2 giây)
        placement: 'top', // Vị trí thông báo
        onClose: () => {
          console.log('Notification closed');
        },
      });
      alert("...");
    }

    else
      notification.error({
        message: 'Operation failed',  // Tiêu đề thông báo lỗi
        description: 'An error occurred while saving your file. Please try again later.',  // Nội dung thông báo lỗi
        duration: 3,  // Thời gian hiển thị (3 giây)
        placement: 'topRight',  // Vị trí thông báo
        onClose: () => {
          console.log('Error notification closed');
        },
      });

    console.log(data);
  }


 



  return (
    <div className="flex flex-row items-center gap-10 mt-[2%]">
      <div className="flex items-center flex-col">
        {/* Avatar */}
        <div className="relative">
          <img
            src={image || "https://via.placeholder.com/150"} // Nếu có ảnh thì hiển thị ảnh, không có thì dùng placeholder
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>

        {/* Chọn file */}
        <div className="mt-4 flex items-center gap-2">
          <div className="p-2 border-solid border-2 border-slate-400 rounded-lg flex-grow">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file:border-0 file:bg-[#4c6ef5] file:hover:bg-[#3a56d0] file:text-white file:cursor-pointer file:py-2 file:px-4 
              file:rounded-lg file:shadow-md file:transition-all file:duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
          <div
            style={{
              backgroundColor: clicked ? "#872030" : "#202142", // Màu thay đổi khi click
            }}
            onClick={handleUpload}
            className="font-medium border-[1px] bg-blue-800 hover:bg-[#202162] text-white cursor-pointer border-[#000000] 
            px-4 py-4 rounded-md font-Roboto tracking-tight max-[1024px]:px-4 max-[1024px]:py-4 max-[1024px]:text-sm"
          >
            Save Picture
          </div>
        </div>


        {/* Hiển thị tên file */}

      </div>
    </div>
  );
}
