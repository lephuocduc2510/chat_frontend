import React, { useEffect, useRef, useState } from "react";
import Profile from "../components/SettingsComponents/Profile";
import InputName from "../components/SettingsComponents/InputName";
import InputEmail from "../components/SettingsComponents/InputEmail";
import InfoIcon from '@mui/icons-material/Info';
import { Button, Form, Input, Modal, notification } from "antd";
import axios, { AxiosError } from "axios";
import { axiosClient } from "../libraries/axiosClient";
import InputPhone from "../components/SettingsComponents/InputPhone";
import { click } from "@testing-library/user-event/dist/click";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../redux/User/userSlice";
import { RootState } from "../redux/store";

export default function Settings() {
  const [form] = Form.useForm(); // Tạo form instance
  const dispatch = useDispatch();
  const reduxData = useSelector((state: RootState) => state.user.userInfo);
  const storedData = JSON.parse(localStorage.getItem('info') || '{}');
  const [name, setName] = useState(storedData.name);
  const [email, setEmail] = useState(storedData.userName);
  const [phoneNumber, setPhoneNumber] = useState(storedData.phoneNumber);
  const [clicked, setClicked] = useState(false);
  const isFirstRender = useRef(true);
  const [isModalOpen, setIsModalOpen] = useState(false);





  useEffect(() => {
    if (reduxData) {
      setName(reduxData.name);
      setPhoneNumber(reduxData.phoneNumber);
    }
  }, [reduxData]); // Chỉ chạy khi reduxData thay đổi



  //Submit change password
  const handleSubmit = async (values: any) => {
    console.log(values);
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
       "Content-Type": "application/json",
      },
    };
    try {
      const response = await axiosClient.post("/api/auth/change-password", values, config);
    
      if (response.status === 200) {
        notification.success({
          message: "Password Changed",
          description: "Your password has been successfully updated.",
          duration: 2,
          placement: "top",
        });
        setIsModalOpen(false);
        // xoá hết các trường trong form
        form.resetFields();


      }
    } catch (error) {
      console.error(error);  
      // Lấy thông báo lỗi từ API nếu có   
      notification.error({
        message: "Change password Failed",
        description: "Your Password Is Incorrect ",  // Hiển thị lỗi lấy từ API hoặc lỗi mặc định
        duration: 3,
        placement: "topRight",
      });
    }

  }


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
        dispatch(setUserInfo(response.data.result));
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
          <InputEmail email={email} setEmail={(value) => setEmail(value)} />
          <InputName name={name} setName={(value) => setName(value)} />
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
          <div className="flex flex-col items-center">
            {/* Trigger Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md shadow hover:bg-blue-600"
            >
              Change Password
            </button>

            {/* Modal */}
            <Modal
              title={
                <h2 className="text-lg font-semibold text-blue-600 text-center">
                  Change Password
                </h2>
              }

              open={isModalOpen}
              onCancel={() => setIsModalOpen(false)}
              footer={null}
              bodyStyle={{ padding: "20px" }}
              style={{
                top: 50,
              }}
            >
              <Form
              form = {form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-4"
              >
                <Form.Item
                  label="Current Password"
                  name="currentPassword"
                  rules={[
                    { required: true, message: "Please enter your current password!" },
                  ]}
                >
                  <Input.Password placeholder="Enter current password" />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  label="New Password"
                  rules={[
                    { required: true, message: 'Please enter your password!' },
                    {
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.reject(new Error());
                        }
                        // Điều kiện mật khẩu: ít nhất 1 chữ cái in hoa, 1 số, 1 ký tự đặc biệt
                        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
                        if (!passwordRegex.test(value)) {
                          return Promise.reject(
                            new Error(
                              'Password must be at least 8 characters and include an uppercase letter, a number, and a special character.'
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirm your password" />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                >
                  Submit
                </Button>
              </Form>
            </Modal>
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
