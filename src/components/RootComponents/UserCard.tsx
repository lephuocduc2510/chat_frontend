import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/User/hook';

const UserCard: React.FC = () => {
  const Obj = JSON.parse(localStorage.getItem('info') || '{}');

  // const Name = 'User'
  // const image = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  const dispatch=useDispatch();
  const dataredux = useAppSelector((state) => state.user.userInfo);

  const [Name,setName]=useState(Obj?.name);
  const [image, setImage] = useState(Obj?.imageUrl) ;             // Hình ảnh giả lập

  return (
    <div className='flex flex-row items-center ml-[10%] max-[1024px]:hidden'>
      <Avatar 
        alt="User-pic" 
        sx={{ width: 48, height: 48 }} 
        src={image} 
        imgProps={{ referrerPolicy: "no-referrer" }} // Thêm referrerPolicy ở đây
      />
      <div className='flex flex-col ml-2'>
        <div className='max-[1250px]:text-[12px] font-bold font-Roboto text-sm'>{Name}</div>
        <div className="max-[1250px]:text-[10px] text-xs cursor-pointer text-[#979797]">
          Logout
        </div>
      </div>
    </div>
  );
};

export default UserCard;
