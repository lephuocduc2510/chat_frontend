import React from 'react';
import { Chip } from '@mui/material';
import Avatar from '@mui/material/Avatar';

// Định nghĩa kiểu dữ liệu cho `value`
interface NormalChipProps {
  value: {
    name: string;
    pic: string;
  };
}

// Hàm tạo màu ngẫu nhiên
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const NormalChip: React.FC<NormalChipProps> = ({ value }) => {
  const color = getRandomColor();  // Sử dụng hàm tự tạo màu ngẫu nhiên

  return (
    <Chip
      style={{
        backgroundColor: color,
        color: 'white',
        fontSize: '14px',
        marginLeft: '5px',
        marginTop: '5px',
      }}
      avatar={
        <Avatar
          alt={value.name}
          src={
            value.pic.startsWith('user')
              ? `${process.env.REACT_APP_API_URL}/${value.pic}`
              : `${value.pic}`
          }
        />
      }
      label={value.name.split(' ')[0]}
      variant="filled"
    />
  );
};

export default NormalChip;
