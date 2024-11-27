import { Button, Card, Form, Input, Space, Table, Popconfirm, message, Modal, Select } from 'antd';
import React from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
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
};


const token = localStorage.getItem('token')

export default function Users({ }: Props) {


    const [users, setUsers] = React.useState([]);
    const [selectedUser, setSelectedUser] = React.useState<any>(null);
    const [createForm] = Form.useForm<FieldType>();
    const [updateForm] = Form.useForm<FieldType>();

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
            message.success('user deleted successfully!');
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
            message.success('user updated successfully!');
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'id', // Không bắt buộc nếu chỉ hiển thị số thứ tự
            key: 'id',
            width: '20%',
            render: (_: any, __: any, index: number) => index + 1, // index là chỉ số của hàng (bắt đầu từ 0)
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
        // {
        //     title: 'Created at',
        //     dataIndex: 'created_at',
        //     key: 'created_at',
        // },
        // {
        //     title: 'Updated at',
        //     dataIndex: 'updated_at',
        //     key: 'updated_at',
        // },

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
                                setSelectedUser(record);
                                updateForm.setFieldsValue(record);
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
        <div style={{ padding: 36 , marginTop: 50}}>
            <Card title='Create new user' style={{ width: '100%' }}>
                <Form form={createForm} name='create-user' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ name: '', description: '' }} onFinish={onFinish}>
                    <Form.Item<FieldType>
                        label='Username'
                        name='userName'
                        rules={[{ required: true, message: 'Please input username!', type: 'email' }]}
                        hasFeedback

                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label='Name'
                        name='name'
                        rules={[{ required: true, message: 'Please input email!' }]}
                        hasFeedback
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                        hasFeedback
                    >
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


            <Card title='List of users' style={{ width: '100%', marginTop: 36 }}>
                <Table dataSource={users} columns={columns} />
            </Card>




             {/* Sửa user */}

            <Modal
                centered
                title='Edit user'
                open={selectedUser}
                okText='Save changes'
                onOk={() => {
                    updateForm.submit();
                }}
                onCancel={() => {
                    setSelectedUser(null);
                }}
            >
                <Form form={updateForm} name='update-user' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ name: '', description: '' }} onFinish={onUpdate}>
                    <Form.Item<FieldType>
                        label='name'
                        name='name'
                        rules={[{ required: true, message: 'Please input username!' }]}
                        
                        hasFeedback

                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label='Username'
                        name='userName'
                        rules={[{ required: true, type: 'email', message: 'Please input email!' }]}
                        hasFeedback
                    >
                        <Input  disabled/>
                    </Form.Item>

                

                    <Form.Item<FieldType>
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                        hasFeedback
                    >
                        <Select>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="mod">Mod</Select.Option>
                            <Select.Option value="user">User</Select.Option>
                        </Select>
                    </Form.Item>


                    {/* <Form.Item<FieldType>
                        label='Verified'
                        name='emailConfirmed'
                        rules={[{  message: 'Please input verified!', type: 'boolean' }]}
                        hasFeedback
                    >
                        <Select>
                            <Select.Option value="1">True</Select.Option>
                            <Select.Option value="2">False</Select.Option>
                            
                        </Select>
                    </Form.Item> */}


                    {/* <Form.Item<FieldType>
                        label='Created_at'
                        name='created_at'
                        rules={[{  message: 'Please input created_at!', type: 'date' }]}
                        hasFeedback
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label='Updated_at'
                        name='updated_at'
                        rules={[{  message: 'Please input update date!', type: 'date' }]}
                        hasFeedback
                    >
                        <Input />
                    </Form.Item> */}
                </Form>
            </Modal>
        </div>
    );
}