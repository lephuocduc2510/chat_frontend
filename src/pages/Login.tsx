
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


