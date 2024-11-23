interface User {
  _id: string;
  name: string;
  pic: string;
}

interface Message {
  sender: User;
  content: string;
  _id: string;
}

// Lấy thông tin người dùng từ `localStorage`
export const getSender = (users: User[]): User => {
  const loggedUser = JSON.parse(localStorage.getItem('info') || '{}') as User;
  const user = users[0]._id === loggedUser._id ? users[1] : users[0];
  return user;
};

export const getUsersLeavingMe = (users: User[]): User[] => {
  const loggedUser = JSON.parse(localStorage.getItem('info') || '{}') as User;
  const newArray = users.filter((data) => data._id !== loggedUser._id);
  return newArray;
};

export const isSender = (id: string): boolean => {
  const loggedUser = JSON.parse(localStorage.getItem('info') || '{}') as User;
  return loggedUser._id === id;
};

export const isSameUser = (messages: Message[], index: number): boolean => {
  if (
    index !== 0 &&
    messages[index].sender._id === messages[index - 1].sender._id
  ) {
    return true;
  } else {
    return false;
  }
};
