import React from 'react';
import { TextField } from '@mui/material';

interface InputNameProps {
  name: string; // Giá trị name
  setName: (value: string) => void; // Hàm để cập nhật name
}

const InputName: React.FC<InputNameProps> = ({ name, setName }) => {
  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <TextField
      value={name}
      onChange={nameHandler}
      id="outlined-read-only-input"
      label="Name"
      style={{ width: '40%' }}
    />
  );
};

export default InputName;
