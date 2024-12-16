import React, { useEffect } from 'react';
import logo from '../assets/images/send-mail.png';
import Title from '../components/ChatComponents/Title';
import Menu from '../components/RootComponents/Menu';
import { Outlet, redirect } from 'react-router-dom';
import UserCard from '../components/RootComponents/UserCard';
import { useLoaderData } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { axiosClient } from '../libraries/axiosClient';
import { useDispatch } from 'react-redux';
import { set } from 'date-fns';
import { setUserInfo } from '../redux/User/userSlice';
import store from '../redux/store'; // Import store của bạn
// Định nghĩa kiểu dữ liệu cho `data` trả về từ loader
interface User {
  _id: string;
  name: string;
  email: string;
  [key: string]: any; // Nếu có các thuộc tính khác chưa rõ ràng
}


  

export default function Root() {
  return (


    <div className='h-[100vh] flex flex-row'>
      <div className='h-[100vh] max-[1250px]:w-[18vw] max-[1024px]:w-[8vw] w-[20vw] grid grid-rows-[1fr,6fr,0.8fr]'>
        <div className=" flex  flex-row  items-center border-[1px] border-[#f5f5f5]">
          <div className='flex flex-row ml-[15%]  items-center'>
            <img alt='logo' className="h-8 mr-1 max-[1250px]:h-7" src={logo} />
            <Title black={true} title='ChatBox' />
          </div>
        </div>
        <div className='border-[1px] border-[#f5f5f5]'>
          <Menu />
        </div>
        <div className='border-[1px] border-[#f5f5f5] flex item-center'>
          <UserCard />
        </div>
      </div>
      <Outlet />
    </div>
  );
}




// Định nghĩa kiểu dữ liệu cho tham số của loader
interface LoaderArgs {
  request: Request;
}

export async function loader({ request }: LoaderArgs) {
 
  
  const tokken = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${tokken}`,
      'Content-Type': 'application/json',

    },
  };
 
  const response = await axiosClient.get("/user/auth/verify", config);
  if (response.status !== 200) {
    return redirect('/404');
  }
  const user = response.data;
  localStorage.setItem('info', JSON.stringify(user));
  store.dispatch(setUserInfo(user));
  return user;
}
  
  

