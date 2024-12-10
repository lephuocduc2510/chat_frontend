import { Button, Card, Form, Input, Space, Table, Popconfirm, message, Modal, Select } from 'antd';
import React from 'react';
import { DeleteOutlined, EditOutlined, RetweetOutlined } from '@ant-design/icons';
import Password from 'antd/es/input/Password';
import { axiosClient } from '../../../libraries/axiosClient';

type Props = {};

type FieldType = {
    id: string;
    userName: string;
    name: string;
    role: string;
    emailConfirmed: boolean;
    created_at: string;
    updated_at: string;
    password: string;
};

const token = localStorage.getItem('token');

export default function Users({ }: Props) {

    const [users, setUsers] = React.useState([]);
    const [selectedUser, setSelectedUser] = React.useState<any>(null);
    const [createForm] = Form.useForm<FieldType>();
    const [updateForm] = Form.useForm<FieldType>();
    const [resetPasswordVisible, setResetPasswordVisible] = React.useState(false);
    const [email, setEmail] = React.useState<string>('');
    const [newPassword, setNewPassword] = React.useState<string>('');
    const [isEditUserModalVisible, setIsEditUserModalVisible] = React.useState(false);

    const getUsers = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await axiosClient.get('/api/user', config);
            setUsers(response.data.result);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    React.useEffect(() => {
        getUsers();
    }, []);

    const onFinish = async (values: any) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            console.log('Success:', values);
            await axiosClient.post('/api/user', values, config);
            getUsers();
            createForm.resetFields();
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const onDelete = async (id: number) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            await axiosClient.delete(`/api/user/${id}`, config);
            getUsers();
            message.success('User deleted successfully!');
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const onUpdate = async (values: any) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            console.log('Success:', values);
            await axiosClient.put(`/api/user/${selectedUser.id}`, values, config);
            getUsers();
            setSelectedUser(null);
            message.success('User updated successfully!');
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const onResetPassword = async () => {
        try {
            console.log('Email:', email);  // Kiểm tra giá trị email
            console.log('New Password:', newPassword);  // Kiểm tra mật khẩu mới

            // Đảm bảo gửi đúng dữ liệu trong payload
            const response = await axiosClient.post('/api/auth/reset-password-user', {
                email: email,  // Đảm bảo email được gửi
                password: newPassword,  // Đảm bảo mật khẩu mới được gửi
            });

            message.success('Password updated successfully!');
            setResetPasswordVisible(false);
            getUsers();
        } catch (error) {
            console.error('Error resetting password:', error);
            message.error('Failed to reset password!');
        }
    };



    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            width: '20%',
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Username',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Verified',
            dataIndex: 'emailConfirmed',
            key: 'emailConfirmed',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: '1%',
            render: (text: any, record: any) => {
                return (
                    <Space size='small'>
                        <Button
                            type='primary'
                            icon={<EditOutlined />}
                            onClick={() => {
                                setSelectedUser(record);  // Lưu thông tin người dùng đã chọn
                                updateForm.setFieldsValue(record);  // Đổ dữ liệu vào form
                                setIsEditUserModalVisible(true);  // Mở modal chỉnh sửa
                            }}
                        />

                        <Button
                            type='primary'
                            icon={<RetweetOutlined />}
                            onClick={() => {
                                setSelectedUser(record);  // Lưu thông tin người dùng đã chọn
                                setEmail(record.userName);  // Cập nhật email
                                setResetPasswordVisible(true);  // Mở modal reset mật khẩu
                            }}
                        />


                        <Popconfirm
                            title='Delete the user'
                            description='Are you sure to delete this user?'
                            onConfirm={() => {
                                onDelete(record.id);
                            }}
                        >
                            <Button type='primary' danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    return (
        <div style={{ padding: 36, marginTop: 50 }}>
            <Card title='Create new user' style={{ width: '100%' }}>
                <Form form={createForm} name='create-user' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ name: '', description: '' }} onFinish={onFinish}>
                    <Form.Item<FieldType>
                        label='Username'
                        name='userName'
                        rules={[{ required: true, message: 'Please input username!', type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label='Name'
                        name='name'
                        rules={[{ required: true, message: 'Please input name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role!' }]}>
                        <Select>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="mod">Mod</Select.Option>
                            <Select.Option value="user">User</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type='primary' htmlType='submit'>
                            Save changes
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card title='List of users' style={{ width: '100%', marginTop: 36, maxHeight: 500, overflow: "auto"}}>
                <Table dataSource={users} columns={columns} />
            </Card>

            {/* Modal for Reset Password */}
            <Modal
    title="Reset Password"
    visible={resetPasswordVisible}
    onOk={onResetPassword}
    onCancel={() => setResetPasswordVisible(false)}
    okText="Save Changes"
    cancelText="Cancel"
>
    <Form>
        <Form.Item label="Email" name="email">
            <Input value={email} disabled />  {/* Hiển thị giá trị email */} 
        </Form.Item>

        <Form.Item
            label="New Password"
            name="password"
            rules={[{ required: true, message: 'Please input a new password!' }]}>
            <Password
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
        </Form.Item>
    </Form>
</Modal>


            {/* Modal for Update User */}
            <Modal
                centered
                title='Edit user'
                open={isEditUserModalVisible} // Sử dụng state mới
                okText='Save changes'
                onOk={() => {
                    updateForm.submit();
                }}
                onCancel={() => {
                    setIsEditUserModalVisible(false); // Đóng modal khi bấm Cancel
                }}
            >
                <Form form={updateForm} name='update-user' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ name: '', description: '' }} onFinish={onUpdate}>
                    <Form.Item<FieldType>
                        label='Name'
                        name='name'
                        rules={[{ required: true, message: 'Please input name!' }]} >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label='Username'
                        name='userName'
                        rules={[{ required: true, type: 'email', message: 'Please input username!' }]} >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role!' }]} >
                        <Select>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="mod">Mod</Select.Option>
                            <Select.Option value="user">User</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
}
