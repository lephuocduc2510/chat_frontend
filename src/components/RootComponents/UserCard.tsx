import React, { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector } from '../../redux/User/hook';
import { Navigate, redirect } from 'react-router-dom';
import { RootState } from '../../redux/store';

const UserCard: React.FC = () => {
  const Obj = JSON.parse(localStorage.getItem('info') || '{}');

  // const Name = 'User'
  // const image = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  const dispatch=useDispatch();
  const datareduxImg = useSelector((state: RootState) => state.avatar.imageUrl);
  const dataredux = useSelector((state: RootState) => state.user.userInfo);

  const [Name,setName]=useState(Obj?.fullname);
  const [image, setImage] = useState(Obj?.avatar) ;             

  useEffect(() => {
    if (dataredux?.fullname ) {
      setName(dataredux.fullname);

    }
  }, [dataredux]);;

  useEffect(() => {
    if ( datareduxImg) {

      setImage(datareduxImg);
    }
  }, [ datareduxImg]);;


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  }

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
        <div className="max-[1250px]:text-[10px] text-xs cursor-pointer text-[#979797]" onClick={handleLogout}>
          Logout
        </div>
      </div>
    </div>
  );
};

export default UserCard;
