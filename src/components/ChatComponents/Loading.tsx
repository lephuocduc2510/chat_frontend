import React from 'react';
import { Spin, Space } from 'antd';

interface LoadingProps {
  spinning: boolean; // Quản lý trạng thái loading
}

const Loading: React.FC<LoadingProps> = ({ spinning }) => {
  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
      <Space size="middle">
        <Spin spinning={spinning} size="large" />
      </Space>
    </div>
  );
};

export default Loading;
