import React, { useState } from 'react';
import { Form, Input, Button, Typography, Divider, Row, Col, Spin } from 'antd';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const { Text } = Typography;

interface LoginData {
  email: string;
  password: string;
}

const LoginTest: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const onFinish = (values: LoginData) => {
    setSubmitting(true);
    // Simulate async login API call
    setTimeout(() => {
      console.log('Logged in with:', values);
      setSubmitting(false);
    }, 2000);
  };

  return (
    <div className="login-form-container container" style={{ maxWidth: '400px', margin: 'auto', marginBlock: 150, height: 450}}>
      <Form
        name="login"
        initialValues={loginData}
        onFinish={onFinish}
        className="login-form"
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            placeholder="Email address"
            type="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            suffix={
              <button
                type="button"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                style={{ border: 'none', background: 'transparent' }}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </button>
            }
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
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
            <Link to="/forgotpassword" className="text-blue-600">Forgot Password?</Link>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default LoginTest;
