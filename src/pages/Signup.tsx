import React from 'react';
import Main from '../components/SignupComponents/Main';

import { redirect } from 'react-router-dom';
import { ToastContainer, toast, ToastContainerProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AuthData {
  name: string;
  email: string;
  password: string;
  pic?: string;
}

interface ActionParams {
  request: Request;
}

const notify = (message: string): void => {
  toast.error(message, {
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

const Signup: React.FC = () => {
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
      <Main />
      </>
   
  );
};

export default Signup;

export async function action({ request }: ActionParams) {
  const data = await request.formData();
  const authData: AuthData = {
    name: data.get('name') as string,
    email: data.get('email') as string,
    password: data.get('password') as string,
  };

  const isGoogleSignIn = data.get('isGoogle') === 'true'; // Assumption: 'isGoogle' field is a string.
  
  if (isGoogleSignIn) {
    const tData = { ...authData, pic: data.get('pic') as string };
    const gresponse = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/ispresent`, {
      method: request.method,
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(tData),
    });

    const gresponseData = await gresponse.json();
    if (gresponseData.status === 'success') {
      localStorage.setItem('jwt', gresponseData.token);
      return redirect('/home/message');
    }
  }

  let information: AuthData = authData;
  if (isGoogleSignIn) {
    information = { ...authData, pic: data.get('pic') as string };
  }

  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/signup`, {
    method: request.method,
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(information),
  });

  const responseData = await response.json();

  if (responseData.status === 'fail') {
    notify('Something went wrong');
    return null;
  }

  localStorage.setItem('jwt', responseData.token);
  return redirect('/home/message');
}
