import React from 'react';
import { TextField } from '@mui/material';

interface InputEmailProps {
  email: string; // Giá trị email
  setEmail: (value: string) => void; // Hàm để cập nhật email
}

const InputEmail: React.FC<InputEmailProps> = ({ email, setEmail }) => {
  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <TextField
      disabled
      id="outlined-read-only-input"
      label="Email"
      onChange={emailHandler}
      value={email}
      style={{ width: '50%' }}
    />
  );
};

export default InputEmail;
