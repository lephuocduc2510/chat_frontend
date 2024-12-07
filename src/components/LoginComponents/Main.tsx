import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Square from './Square';
import { useSubmit } from 'react-router-dom'
import { Box, CircularProgress, IconButton, Paper } from '@mui/material';
import { Email, Visibility, VisibilityOff } from '@mui/icons-material';
import { FaArrowCircleLeft } from 'react-icons/fa';
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { axiosClient } from '../../libraries/axiosClient';
import { Form, Input, Button, Row, Col, Divider, Spin, Typography, message, Modal } from 'antd';
import { useDispatch } from 'react-redux';
const { jwtDecode } = require('jwt-decode');
const { Title, Text } = Typography;


export default function Main() {




  const submit = useSubmit();
  const [loginData, setloginData] = useState({ email: '', password: '' });
  const [submitting, setSubmiting] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [hide, setHide] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [username, setUsername] = useState(''); 
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch();

  const setHideModal = () => {
    setHide(true);
  };

  useEffect(() => {
    // Reset form fields khi chuyển đổi giữa các trang
    form.resetFields();
  }, [currentPage]);


  const getEmail = async (values: any) => {
    try {
      setUsername(values.email); 
      const response = await axiosClient.post('/api/auth/forgot-password', values);
      if (response.status === 200) {
        message.success('Email sent');
        console.log("Email sent", response.data.result);
        setCurrentPage(currentPage + 1) // Chuyển sang trang 2 khi email được gửi thành công
        console.log("Email sent", currentPage);
      } else {
        message.error('Email failed');
        console.log("Email failed", response.data.errors);
      }
    } catch (error) {
      console.error("Email submission failed:", error);
    }

  }

  const changePassword = async (values: any) => {
    try {
      console.log("Change password values", values);
      const response = await axiosClient.post('/api/auth/reset-password', values);
      if (response.status === 200) {
        message.success('Change password success');
        console.log("Change password success", response.data.result);
        setHide(false); // Đóng modal sau khi đổi mật khẩu thành công
        setCurrentPage(1); // Đặt lại trang về ban đầu
      } else {

        message.error("Change password failed");
        console.log("Change password failed", response.data.errors);
      }
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };


  const checkLogin = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('No token found, please login again.');
      window.location.href = '/login';    // Redirect to login page if no token found
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded) {
        console.log("payload", decoded);
        if (decoded.role === "user") {
          message.success('Login success');
          window.location.href = '/home/message';  
          // window.location.href = '/management/users';  // Redirect to users management page
        }
        else if (decoded.role === "mod") {
          message.success('Login success');
          window.location.href = '/home';  
        }
        else
        {
          message.success('Login success');
          window.location.href = '/home/message';  
        }
         
      }

      else {
        message.error('Error');
        console.log("Login failed no payload");

      }
    } catch (error) {
      console.error("Login failed", error);
      message.error('An error occurred while checking login status');
      window.location.href = '/404-page'; // Redirect to 404 page in case of error
    }
  };

  
  const onFinish = async (values: any) => {
    try {
      const response = await axiosClient.post('/api/auth/login', values);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.result.accessToken);
        message.success('Login success');
        console.log("Login success", response.data.result.accessToken);

        checkLogin();

      } else {  
    
        
        const error = response.data.errors?.message || 'Login failed'; 
        setErrorMessage(error); 
        message.error(error);
        console.log("Login failed", response.data.errors[0]); 
      }
    } catch (error: any) {
      if (error.response && error.response.data && Array.isArray(error.response.data.errors)) {
        const errors = error.response.data.errors;
        setErrorMessage(errors[0]); 
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };



  return (
    <div className='flex flex-col items-center h-[100vh] w-[100vw] relative overflow-hidden px-2'>
      <Square isRight={false}></Square>
      <Square isRight={true}></Square>
      <Paper className='z-20 w-full max-w-[370px] p-[2rem] my-auto' elevation={3}>
        <Link to="/"><FaArrowCircleLeft className="text-blue-600 cursor-pointer text-2xl"></FaArrowCircleLeft></Link>
        <div className='font-Poppins text-3xl font-extrabold flex items-center flex-col'>
          <LockOpenIcon fontSize='large' color='primary' />
          <Title level={5} style={{ textAlign: 'center' }}>Log In</Title>
        </div>
        <br />
        <hr></hr>

        <Form
          name="login"
          initialValues={loginData}
          className="login-form mt-4"
          layout='vertical'
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          
        >
           <Form.Item
            label="Email ID"
            name="username"
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
              min: 6,
              message: 'Password must be at least 6 characters long!',
            },
          ]}
          validateStatus={errorMessage ? 'error' : ''}
          help={errorMessage}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className='mt-4'
              block
              size="large"
              disabled={submitting}
              style={{ padding: '0.5rem 2rem' }}
            >
              {submitting ? <Spin size="small" /> : 'LOG IN'}
            </Button>
          </Form.Item>

          <Row justify="center">
            <Col>
              <Text>
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600">SignUp</Link>
              </Text>
            </Col>
          </Row>

          <Divider />

          <Row justify="center">
            <Col>
              <Text>
                <Button
                  type="link"
                  onClick={setHideModal}
                  style={{ padding: '0' }}
                >
                  Forgot password?
                </Button>
              </Text>
            </Col>
          </Row>
        </Form>


        


      </Paper>



        <Modal
    centered
    title={
      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4A90E2' }}>
        {currentPage === 1 ? 'Forgot Password' : 'Change Password'}
      </span>
    }
    open={hide}
    okText={
      <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>
        {currentPage === 1 ? 'Next' : 'Complete'}
      </span>
    }
    cancelText={
      <span style={{ fontSize: '1rem' }}>
        {currentPage === 1 ? 'Cancel' : 'Back'}
      </span>
    }
    onOk={() => {
      form
        .validateFields()
        .then(() => {
          if (currentPage === 1) {
            form.submit(); // Submit cho form gửi email
          } else {
            changePassword(form.getFieldsValue()); // Gửi yêu cầu đổi mật khẩu
          }
        })
        .catch((info) => {
          console.log('Validation Failed:', info);
        });
    }}
    onCancel={() => {
      if (currentPage === 2) setCurrentPage(1);
      else setHide(false);
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
    {currentPage === 1 ? (
      <Form
        form={form}
        layout="vertical"
        onFinish={getEmail}
        style={{
          background: '#ffffff',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Form.Item
          name="email"
          label={
            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#4A90E2' }}>
              Email
            </span>
          }
          rules={[{ required: true, message: 'Please enter your email!', type: 'email' }]}
        >
          <Input
            placeholder="Enter your email"
            style={{
              borderRadius: '8px',
              padding: '10px',
              fontSize: '1rem',
            }}
          />
        </Form.Item>
      </Form>
    ) : (
      <Form
        form={form}
        layout="vertical"
        onFinish={changePassword}
        style={{
          background: '#ffffff',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Form.Item
          name="token"
          label={
            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#4A90E2' }}>
              Code
            </span>
          }
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

        <Form.Item
          name="email"
          initialValue={username}
          style={{ display: 'none' }}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="password"
          label={
            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#4A90E2' }}>
              Password
            </span>
          }
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password
            placeholder="Enter your password"
            style={{
              borderRadius: '8px',
              padding: '10px',
              fontSize: '1rem',
            }}
          />
        </Form.Item>

        <Form.Item
          name="passwordConfirm"
          label={
            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#4A90E2' }}>
              Confirm Password
            </span>
          }
          dependencies={['password']}
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
          <Input.Password
            placeholder="Confirm your password"
            style={{
              borderRadius: '8px',
              padding: '10px',
              fontSize: '1rem',
            }}
          />
        </Form.Item>
      </Form>
    )}
  </Modal>

    </div>
  )
}
