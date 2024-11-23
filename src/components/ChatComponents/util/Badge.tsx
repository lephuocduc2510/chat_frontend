import React from 'react';

// Định nghĩa kiểu cho props, với children có kiểu dữ liệu React.ReactNode
interface BadgeProps {
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ children }) => {
  return (
    <div className='bg-[#FF0000] text-white text-xs h-4 w-4 flex flex-row justify-center items-center rounded-full'>
      {children}
    </div>
  );
};

export default Badge;
