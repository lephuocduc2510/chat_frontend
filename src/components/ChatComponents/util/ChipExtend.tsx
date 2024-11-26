import React from 'react';
import { Chip } from '@mui/material';
import Avatar from '@mui/material/Avatar';

// Định nghĩa kiểu cho props
interface ChipExtendProps {
  value: {
    id: string;
    pic: string;
    name: string;
  };
  remove: (id: string) => void; // Hàm remove nhận tham số là id kiểu string
}

const ChipExtend: React.FC<ChipExtendProps> = ({ value, remove }) => {

  const handleDelete = () => {
    remove(value.id); // Gọi hàm remove với _id của value
  };

  return (
    <Chip
      color="primary"
      style={{ color: 'black', fontSize: '14px', fontWeight: 'bold', marginLeft: '5px', marginTop: '5px' }}
      avatar={
        <Avatar
          alt="Natacha"
          src={value.pic}
          style={{ objectFit: 'cover' }} // Thêm thuộc tính này nếu cần
        />
      }
      onDelete={handleDelete}
      label={value.name.split(' ')[0]} // Hiển thị tên đầu tiên trong value.name
      variant="outlined"
    />
  );
};

export default ChipExtend;
