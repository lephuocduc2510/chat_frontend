
// import * as React from 'react';
// import Item from './Item';
// const { jwtDecode } = require('jwt-decode');

// export default function Menu() {
//   const token = localStorage.getItem('token');
//   const decoded = jwtDecode(token);
//   return (
//     <div className='flex flex-col items-center'>
//       <div className='w-[80%]'>
//       {/* <Item val={1} to='search' text='Search'></Item> */}
//       <Item val={4} to='message' text='Messages'></Item>
//       <Item val={3} to='settings' text='Settings'></Item>
//       if (decoded.role === "admin") {
//       <Item val={3} to='settings' text='Dashboard'></Item>
//       }
//       </div>
//     </div>
//   );
// }

import * as React from 'react';
import Item from './Item';
const jwtDecode = require('jwt-decode'); // Ensure correct import for jwtDecode

export default function Menu() {
  const token = localStorage.getItem('token');
  let decoded = null;

  // Decode the token safely
  try {
    if (token) {
      decoded = jwtDecode(token);
    }
  } catch (error) {
    console.error("Invalid token:", error);
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='w-[80%]'>
        {/* Conditional rendering */}
        <Item val={4} to='message' text='Messages'></Item>
        <Item val={3} to='settings' text='Settings'></Item>
        {decoded?.role === "admin" && (
          <Item val={3} to='dashboard' text='Dashboard'></Item>
        )}
      </div>
    </div>
  );
}
