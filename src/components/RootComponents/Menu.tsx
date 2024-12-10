import * as React from 'react';
import Item from './Item';
const { jwtDecode } = require('jwt-decode');

export default function Menu() {
  const token = localStorage.getItem('token');
  console.log("Token:", token);
  let decoded = null;

  try {
    if (token) {
      decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
    } else {
      console.warn("Token not found in localStorage.");
    }
  } catch (error) {
    console.error("Invalid token:", error);
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='w-[80%]'>
        <Item val={4} to='message' text='Messages'></Item>
        <Item val={3} to='settings' text='Settings'></Item>
        {decoded?.role === "admin" && (
          <Item val={5} to='/admin/users' text='Dashboard'></Item>
        )}
      </div>
    </div>
  );
}