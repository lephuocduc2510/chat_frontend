import React from 'react'
import ChipExtend from './util/ChipExtend'

interface User {
  _id: string;
  name: string;
  pic: string;
}

interface GroupUserListProps {
  users: User[]; // Mảng các đối tượng người dùng
  remove: (userId: string) => void; // Hàm xóa người dùng, truyền vào userId
}

export default function GroupUserList({ users, remove }: GroupUserListProps) {
  return (
    <div className='self-start flex flex-row mt-4 flex-wrap'>
      {users.map((data, index) => (
        <ChipExtend remove={remove} value={data} key={index}></ChipExtend>
      ))}
    </div>
  )
}
