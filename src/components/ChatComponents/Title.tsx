import React from 'react';

// Định nghĩa kiểu dữ liệu cho props
interface TitleProps {
  title: string; // Tiêu đề dưới dạng chuỗi
  black: boolean; // Kiểu boolean cho điều kiện "black"
}

export default function Title({ title, black }: TitleProps) {
  if (black === true) {
    return (
      <div className="max-[1250px]:text-2xl max-[1024px]:hidden font-serif tracking-tighter text-3xl font-bold text-black">
        {title}
      </div>
    );
  }

  return (
    <div className="max-[1250px]:text-2xl font-serif tracking-tighter text-3xl font-bold text-[#0538FF]">
      {title}
    </div>
  );
}
