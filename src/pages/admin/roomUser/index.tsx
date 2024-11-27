import { Button, Card, Form, Input, Space, Table, Popconfirm, message, Modal, Select, Checkbox } from 'antd';
import React from 'react';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import Password from 'antd/es/input/Password';
import { axiosClient } from '../../../libraries/axiosClient';
import TextArea from 'antd/es/input/TextArea';
import { useParams } from 'react-router-dom';
import { title } from 'process';


type Props = {};



type FieldType = {
    username: string;
}

const token = localStorage.getItem('token')

export default function RoomsUser({ }: Props) {

    //lấy id room từ params và chuyển sang kiểu int
    const { id } = useParams();
    if (!id) {
        throw new Error('Id is required');
    }


    const [selectedRowKeys, setSelectedRowKeys] = React.useState<any[]>([]);
    const idRooms = parseInt(id);
    const [createForm] = Form.useForm<FieldType>();
    const [user, setUsers] = React.useState([]);
    const [listUser, setListUser] = React.useState([]);


    const getUser = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {

            const reponse = await axiosClient.get('/api/user', config);
            const username = reponse.data.result;
            setUsers(username);
        }

        catch (error) {
            console.log('Error:', error);
        }
    };





    const getUserInRoom = async () => {

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {

            const response = await axiosClient.get(`/api/Rooms-User/${idRooms}`, config);
            setListUser(response.data.result);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    React.useEffect(() => {
        getUserInRoom();
        getUser();
    }, []);



    // Hàm xử lý khi checkbox thay đổi
    const onSelectChange = (id: number, checked: boolean) => {
        setSelectedRowKeys((prev) =>
            checked ? [...prev, id] : prev.filter((key) => key !== id)
        );
    };




    //Thêm user
    const handleAddUser = async (values: any) => {
        const idUser = values.username;
        const data = {
            idRooms,
            idUser,
            "idPerAdd": "string"
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            console.log('Success:', data);
            await axiosClient.post('/api/Rooms-User/add-user-in-room', data, config);
            getUserInRoom();
            createForm.resetFields();
        } catch (error) {
            console.log('Error:', error);
        }
    };


    // Hàm xử lý khi nhấn nút xóa
    const onDelete = async (ids: number[]) => {
        // Tạo đối tượng `data` chứa thông tin cần gửi
        const data = {
            idRooms,
            idUser: ids, // Gán mảng ID vào đây
        };

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            console.log('Data to send:', data);
            await axiosClient.delete('/api/Rooms-User/remove-user-out-room', {
                data, // Gửi dữ liệu trong phần body của request
                ...config,
            });

            // Làm mới danh sách người dùng trong phòng sau khi xóa
            getUserInRoom();
            setSelectedRowKeys([]); 
            message.success('Users deleted successfully!');
        } catch (error) {
            console.error('Delete failed:', error);
        }
    }

    //Xoá nhiều user


    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Please select at least one user to delete.');
            return;
        }
        onDelete(selectedRowKeys); // Gọi hàm với danh sách ID
    };





    const confirmDelete = () => {
        Modal.confirm({
            title: 'Are you sure you want to delete the selected users?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: handleBulkDelete,
            onCancel() {
                console.log('Delete action canceled');
            },
        });
    };



    const columns = [
        {
            title: '', // Cột select
            key: 'select',
            width: '5%',
            render: (_: any, record: any) => (
                <Checkbox
                    checked={selectedRowKeys.includes(record.id)}
                    onChange={(e) => onSelectChange(record.id, e.target.checked)}
                />
            ),
        },
        {
            title: 'STT',
            dataIndex: 'id', // Không bắt buộc nếu chỉ hiển thị số thứ tự
            key: 'id',
            width: '10%',
            render: (_: any, __: any, index: number) => index + 1, // index là chỉ số của hàng (bắt đầu từ 0)
        },
        {
            title: 'Name user',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
        },



        {
            title: 'UserName',
            dataIndex: 'userName',
            key: 'userName',
            width: '20%',
        },

        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: '20%',
        },
        // {
        //     title: 'Created Date',
        //     dataIndex: 'createdDate',
        //     key: 'createdDate',
        //     width: '1%',
        // },
        // {
        //     title: 'Created By',
        //     dataIndex: 'createdBy',
        //     key: 'createdBy',
        //     width: '1%',
        // },

        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: '15%',
            render: (text: any, record: any) => {
                return (
                    <Space size="small">

                        {/* Nút xóa */}
                        <Popconfirm
                            title="Delete the user"
                            description="Are you sure to delete this user from room?"
                            onConfirm={() => {
                                onDelete(record.id);
                            }}
                        >
                            <Button type="primary" danger icon={<DeleteOutlined />} />
                        </Popconfirm>


                    </Space>

                );
            },
        },
    ];

    return (
        <div style={{ padding: 36, marginTop: 50 }}>
            <Card title='Add new user to room' style={{ width: '100%' }}>
                <Form form={createForm} name='create-user' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ name: '', description: '' }} onFinish={handleAddUser}>
                    <Form.Item<FieldType>
                        label='Select username need to add'
                        name='username'
                        rules={[{ required: true, message: 'Please input room name!' }]}
                        hasFeedback

                    >
                        <Select
                            mode="multiple"
                            options={user?.map((item: any) => {
                                return {
                                    label: item.userName,
                                    value: item.id,
                                };
                            })}
                        />
                    </Form.Item>



                    <Form.Item<FieldType> wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type='primary' htmlType='submit'>
                            Add user
                        </Button>
                    </Form.Item>
                </Form>


            </Card>


            <Card title='List of users' style={{ width: '100%', marginTop: 36 }}>
                <Table dataSource={listUser} columns={columns} />
                <Form.Item<FieldType> wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                        danger
                        disabled={selectedRowKeys.length === 0}
                        type="primary"
                        htmlType="button"
                        onClick={confirmDelete}
                    >
                        Delete user
                    </Button>
                </Form.Item>
            </Card>




        </div>
    );
}