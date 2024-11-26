import React, { ReactNode } from 'react';
import { Button } from '@mui/material';

interface IconBackProps {
  children: ReactNode; // Định nghĩa kiểu dữ liệu cho children
}

export default function IconBack({ children }: IconBackProps) {
  return (
    <div className='bg-[#F5F5F5] flex justify-center mx-1 items-center overflow-hidden rounded-[50%] h-9 w-9'>
      <Button>
        {children}
      </Button>
    </div>
  );
}
