import React, { useEffect } from 'react';
import logo from '../../../assets/images/admin-logo.webp';
import { Outlet, redirect } from 'react-router-dom';

import { useLoaderData } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Title from '../../../components/ChatComponents/Title';
import AdminMenu from '../../../components/RootComponents/AdminMenu';
import UserCard from '../../../components/RootComponents/UserCard';
import { axiosClient } from '../../../libraries/axiosClient';

// Định nghĩa kiểu dữ liệu cho `data` trả về từ loader
interface User {
  _id: string;
  name: string;
  email: string;
  [key: string]: any; // Nếu có các thuộc tính khác chưa rõ ràng
}

export default function AdminLayout() {
 


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
          <AdminMenu />
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

  
  const cookie = localStorage.getItem('token');
  const config = {  
    headers: { Authorization: `Bearer ${cookie}` },
  };

  if (cookie === null) {
   return redirect('/login');
  }
 
  const username = JSON.parse(atob(cookie.split('.')[1])).unique_name;
 
  const response = await axiosClient.get(`/api/user/${username}`, config);
  const user = response.data.result;

  const parsed = JSON.stringify(user);
  localStorage.setItem('info', parsed);
  console.log(parsed);

  return user;

  // Render lại trang khi có thay đổi trong localStorage

  
  

}
