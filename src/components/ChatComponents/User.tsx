import React from 'react'
import { Avatar } from '@mui/material'


const MotionAnimate = require('react-motion-animate').default

// Định nghĩa kiểu cho props
interface UserProps {
  values: {
    pic: string;
    name: string;
    email: string;
  };
  add: (values: { pic: string; name: string; email: string }) => void;
}

export default function User({ values, add }: UserProps) {

  const clickHandler = () => {
    add(values);
  }

  return (
    <MotionAnimate reset={true}>
      <div onClick={clickHandler} className='flex flex-row box-border cursor-pointer items-center mt-2 hover:bg-gray-100 py-1 px-1'>
      <Avatar
          alt="User-pic"
          style={{
            width: '48px', // Default width
            height: '48px', // Default height
          }}
        />
        <div className='flex flex-col ml-2'>
          <div className='font-bold font-Roboto text-sm'>{values.name}</div>
          <div className="text-xs text-[#979797]">{values.email}</div>
        </div>
      </div>
    </MotionAnimate>
  )
}
