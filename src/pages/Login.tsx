
import React from 'react'
import Main from '../components/LoginComponents/Main'
import { redirect } from 'react-router-dom';
const ReactToastify = require('react-toastify');
const ToastContainer = ReactToastify.ToastContainer;
const toast = ReactToastify.toast;

require('react-toastify/dist/ReactToastify.css');


const notify = (message: any) => {

  return toast.error(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    });
};


export default function Login() {
  return (
   <>
      <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
/>
      <Main></Main>
      </>
    
  )
}




export const action = async ({ request }: { request: Request }) => {
  const data = await request.formData();
  const authdata = {
    email: data.get('email') as string,
    password: data.get('password') as string,
    pic: data.get('pic') as string,
  };

  const isGoogleAuth = data.get('name') as string;
  if (isGoogleAuth) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/login`, {
      method: request.method,
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(authdata),
    });

    const responseData = await response.json();

    if (responseData.status !== 'fail') {
      localStorage.setItem('jwt', responseData.token);
      return redirect('/home/message');
    }

    const authData2 = { ...authdata, name: isGoogleAuth };
    const response2 = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/signup`, {
      method: request.method,
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(authData2),
    });

    const responseData2 = await response2.json();

    if (responseData2.status === 'fail') {
      notify('Something went wrong');
      return null;
    }

    localStorage.setItem('jwt', responseData2.token);
    return redirect('/home/message');
  }

  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/login`, {
    method: request.method,
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(authdata),
  });

  const responseData = await response.json();

  if (responseData.status === 'fail') {
    notify('Something went wrong');
    return null;
  }

  localStorage.setItem('jwt', responseData.token);
  return redirect('/home/message');
};

