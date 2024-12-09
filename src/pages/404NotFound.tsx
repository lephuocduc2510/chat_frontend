import React from 'react';
import NotFoundPageComponent from '../components/404Components';
import { Button, Result } from 'antd';
import { HomeOutlined } from '@mui/icons-material';


const NotFoundPage: React.FC = () => {
  return (
    // <NotFoundPageComponent/>
    <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f0f2f5',
    }}
  >
    <Result
      status="404"
      title="404"
      subTitle="Trang bạn tìm kiếm không tồn tại"
      extra={
        <Button
          type="primary"
          icon={<HomeOutlined />}
          size="large"
          onClick={() => window.location.href = '/home/message'} // Điều hướng về trang chủ
        >
          Quay lại trang chủ
        </Button>
      }
      style={{
        textAlign: 'center',
      }}
    />
  </div>
  );
};

export default NotFoundPage;
