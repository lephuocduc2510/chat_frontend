import React from 'react';

// Định nghĩa kiểu props
interface ListProps {
  text: string;
}

export default function List({ text }: ListProps) {
  return (
    <div className="bg-green-600 text-white">{text}</div>
  );
}
