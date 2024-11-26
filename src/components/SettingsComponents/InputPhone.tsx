import React from 'react';
import { TextField } from '@mui/material';

interface InputNameProps {
  phone: string; // Giá trị name
  setPhone: (value: string) => void; // Hàm để cập nhật name
}

const InputPhone: React.FC<InputNameProps> = ({ phone, setPhone }) => {
  const phoneHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  return (
    <TextField
      value={phone}
      onChange={phoneHandler}
      id="outlined-read-only-input"
      label="Phone Number"
      style={{ width: '40%' }}
    />
  );
};

export default InputPhone;
