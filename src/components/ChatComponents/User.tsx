import React from 'react'
import { Avatar } from '@mui/material'
import { motion } from 'framer-motion';




// Định nghĩa kiểu cho props
interface UserProps {
  values: {
    avatar: string;
    name: string;
    email: string;
  };
  add: (values: { avatar: string; name: string; email: string }) => void;
}

export default function User({ values, add }: UserProps) {

  const clickHandler = () => {
    add(values);
  }

  return (
    <motion.div
      onClick={clickHandler}
      className="flex flex-row box-border cursor-pointer items-center mt-2 hover:bg-gray-100 py-1 px-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Avatar
        alt="User-pic"
        src={values.avatar} // Thêm src để hiện ảnh
        style={{
          width: '48px',
          height: '48px',
        }}
      />
      <div className="flex flex-col ml-2">
        <div className="font-bold font-Roboto text-sm">{values.name}</div>
        <div className="text-xs text-[#979797]">{values.email}</div>
      </div>
    </motion.div>
  )
}
