import React, { useState, useEffect } from 'react';
import Square from '../LoginComponents/Square';
import {  Link, useNavigation } from 'react-router-dom';
import { useSubmit } from 'react-router-dom';
import { Input, Button, Typography, Spin, Form, message, Modal } from 'antd';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {  Icon, IconButton, Paper } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { ToastContainer, toast } from "react-toastify";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FaArrowCircleLeft, FaLeaf } from 'react-icons/fa';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { axiosClient } from '../../libraries/axiosClient';
// import jwt_decode from "jwt-decode"; // Assuming jwt_decode is installed


const { Title, Text } = Typography;

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface PasswordRequirementsProps {
  password: string;
}



const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {

  
  const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const numberRegex = /[0-9]/;
  const uppercaseRegex = /[A-Z]/;

  const boxStyle = {
    border: '1px solid #ccc',
    padding: '8px',
    borderRadius: '4px',
    marginTop: '8px',
    backgroundColor: '#f9f9f9'
  };

  return (
    <div style={boxStyle}>
      <ul>
        <li style={{ color: password.length >= 8 && password.length <= 12 ? 'green' : 'red' }}>
          {password.length >= 8 && password.length <= 12 ? <CheckCircleIcon /> : <CancelIcon />} 8-12 characters
        </li>
        <li style={{ color: numberRegex.test(password) ? 'green' : 'red' }}>
          {numberRegex.test(password) ? <CheckCircleIcon /> : <CancelIcon />} At least one number
        </li>
        <li style={{ color: uppercaseRegex.test(password) ? 'green' : 'red' }}>
          {uppercaseRegex.test(password) ? <CheckCircleIcon /> : <CancelIcon />} At least one uppercase letter
        </li>
        <li style={{ color: specialCharacterRegex.test(password) ? 'green' : 'red' }}>
          {specialCharacterRegex.test(password) ? <CheckCircleIcon /> : <CancelIcon />} At least one special character
        </li>
      </ul>
    </div>
  );
};

const Main: React.FC = () => {
  const navigation = useNavigation();
  const submit = useSubmit();
  const [SignUpData, setSignUpData] = useState<SignUpData>({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [form] = Form.useForm();
  const [verifiedForm] = Form.useForm();

  const [checkForm, setCheckForm] = React.useState(false);


  const onVerify = async (values: any) => {
    try {
      console.log("Verify values", values);
      const data = await axiosClient.post('api/auth/email-verification', values);
      if (data.status === 200) {
        message.success('Verify success');
        console.log("Verify success");
        window.location.href = '/login';
      }
      else {
        message.error('Verify failed');
        console.log("Verify failed", data.data.errors);
      }

    }
    catch (error) {
      console.log("Verify failed", error);

      verifiedForm.setFields([
        {
          name: 'code',
          errors: ['Mã code không hợp lệ. Vui lòng thử lại!'],
        },
      ]);
    }

  }




  const onFinish = async (values: any) => {
    try {

      setUsername(values.userName);
      setLoading(true);  
      setTimeout(() => {      
        setLoading(false);  
      }
        , 5000);
      console.log("Register values", values);
      const data = await axiosClient.post('api/auth/register', values);
      console.log("Register success", data);
      setCheckForm(true);
      message.success('Register success');
      console.info("Register success", data);


    }
    catch (error) {
      console.log("Register failed", error);
      message.error('Register failed');
    }

  };





  useEffect(() => {
    // Update the component when password changes
  }, [SignUpData.password]);



  const errorMessage = (error: any) => {
    console.log(error);
  };

  
  return (
    <div className='flex flex-col items-center h-[100vh] w-[100vw] relative overflow-hidden px-2'>
      <Square isRight={false}></Square>
      <Square isRight={true}></Square>
      <Paper className='z-20 w-full max-w-[370px] p-[2rem] my-auto' elevation={3}>
        <Link to="/"><FaArrowCircleLeft className="text-blue-600 cursor-pointer text-2xl"></FaArrowCircleLeft></Link>
        <div className='font-Poppins text-3xl font-extrabold flex items-center flex-col'>
          <HowToRegIcon fontSize='large' color='primary' />
          <Title level={5} style={{ textAlign: 'center' }}>Sign Up</Title>
        </div>
        <br />
        <hr></hr>


        <Form
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name!' }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item
            label="Email ID"
            name="userName"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
            
          >
            <Input placeholder="Enter Email Address" />
          </Form.Item>
          <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password!' },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(new Error());
                }
                // Điều kiện mật khẩu: ít nhất 1 chữ cái in hoa, 1 số, 1 ký tự đặc biệt
                const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
                if (!passwordRegex.test(value)) {
                  return Promise.reject(
                    new Error(
                      'Password must be at least 8 characters and include an uppercase letter, a number, and a special character.'
                    )
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm your password" />
        </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className='mt-4'
              block
            >
              SIGN UP
            </Button>

          </Form.Item>  


          <div>
      <Typography className="text-center py-3">
        Already have an account?{' '}
        <Link className="text-blue-600" to="/login">
          LogIn
        </Link>
      </Typography>
      <div className="h-[1px] w-[100%] mt-4 bg-[#808080]"></div>
      <div className="flex flex-col items-center mt-6">
        
      </div>
    </div>
        </Form>



      </Paper>



      <Modal
  centered
  title={<span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4A90E2' }}>Verify User</span>}
  open={checkForm}
  okText={<span style={{ fontSize: '1rem', fontWeight: 'bold' }}>Accept</span>}
  cancelText={<span style={{ fontSize: '1rem' }}>Cancel</span>}
  onOk={() => {
    verifiedForm
      .validateFields()
      .then(() => {
        verifiedForm.submit();
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
      });
  }}
  onCancel={() => {
    setCheckForm(false);
  }}
  bodyStyle={{
    padding: '24px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #EAF8FF, #FFFFFF)',
  }}
  okButtonProps={{
    style: {
      backgroundColor: '#4A90E2',
      color: '#fff',
      borderRadius: '8px',
      padding: '8px 16px',
      fontWeight: 'bold',
      border: 'none',
    },
  }}
  cancelButtonProps={{
    style: {
      borderRadius: '8px',
      padding: '8px 16px',
      fontWeight: 'bold',
      border: '1px solid #D9D9D9',
    },
  }}
>
  <Form
    form={verifiedForm}
    layout="vertical"
    onFinish={onVerify}
    style={{
      background: '#ffffff',
      borderRadius: '10px',
      padding: '16px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    }}
  >
    <Form.Item
      name="email"
      label={<span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#4A90E2' }}>Email</span>}
      rules={[{ required: true, message: 'Please enter your email!', type: 'email' }]}
      initialValue={username}
    >
      <Input
        disabled
        style={{
          borderRadius: '8px',
          padding: '10px',
          fontSize: '1rem',
        }}
      />
    </Form.Item>

    <Form.Item
      name="code"
      label={<span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#4A90E2' }}>Code</span>}
      rules={[{ required: true, message: 'Please enter your code!' }]}
    >
      <Input
        placeholder="Enter your code"
        style={{
          borderRadius: '8px',
          padding: '10px',
          fontSize: '1rem',
        }}
      />
    </Form.Item>
  </Form>
</Modal>

    </div>
  );
}


export default Main;
