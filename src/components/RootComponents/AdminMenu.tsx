
import * as React from 'react';
import Item from './Item';

export default function AdminMenu() {

  return (
    <div className='flex flex-col items-center'>
      <div className='w-[80%]'>
      <Item val={1} to='users' text='User'></Item>
      <Item val={0} to='rooms' text='Room'></Item>
      <Item val={3} to='roomUser' text='Settings'></Item>
      <Item val={2} to='profile' text='Profile'></Item>
      </div>
    </div>
  );
}
