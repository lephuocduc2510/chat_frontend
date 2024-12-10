import React, { useEffect } from 'react';
import { Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa'; // Thêm icon từ react-icons
import { Button, Popconfirm } from 'antd';
import { DeleteOutline, PersonAdd } from '@mui/icons-material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

// Định nghĩa kiểu cho props
interface UserProps {
    values: {
        id: string;
        pic: string;
        name: string;
        email: string;
        role: string;
    };
    add: (values: { pic: string; name: string; email: string }) => void;
    remove: (values: { id: string }) => void; // Thêm hàm remove để xóa người dùng
}

export default function GroupUserDetails({ values, add, remove }: UserProps) {
    const clickHandler = () => {
        add(values);
    };
    const [checkMod, setCheckMod] = React.useState(false);
    const [checkModLogin, setCheckModLogin] = React.useState(false);
    const checkRole = async () => {
        if (values.role === 'mod' || values.role === 'admin') {
            setCheckMod(true);
        }
        else {
            setCheckMod(false);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const role = JSON.parse(atob(token.split('.')[1])).role;
            if (role === 'mod' || role === 'admin') {
                setCheckModLogin(true);
            }
            else {
                setCheckModLogin(false);
            }
        }
        checkRole();
    }
        , [values]);

    return (
        <motion.div
            onClick={clickHandler}
            className="flex flex-row box-border cursor-pointer items-center mt-2 hover:bg-gray-100 py-1 px-1 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Avatar
                alt="User-pic"
                src={values.pic}
                style={{
                    width: '48px',
                    height: '48px',
                }}
            />
            <div className="flex flex-col ml-2">
                <div className="font-bold font-Roboto text-sm">{values.name}</div>
                <div className="text-xs text-[#979797]">{values.email}</div>
            </div>
            {/* Nút x đỏ */}

            {checkMod  || !checkModLogin? <></> :
                <Popconfirm
                    title="Are you sure you want to delete this user?"
                    onConfirm={() => remove({ id: values.id })} // Gọi hàm remove nếu người dùng xác nhận
                    okText="Yes"
                    cancelText="No"
                    getPopupContainer={(triggerNode) => {
                        // Kiểm tra nếu triggerNode.parentNode là HTMLElement trước khi trả về
                        return triggerNode?.parentNode instanceof HTMLElement ? triggerNode.parentNode : document.body;
                    }}
                >
                    <div
                        className="text-red-500 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer hover:text-red-700 
    bg-blue border-2 border-red-500 rounded-full p-1 hover:border-red-700 hover:bg-red-500"
                    >
                        <PersonRemoveIcon
                            style={{ fontSize: '20px' }} // Điều chỉnh kích thước icon nếu cần
                        />
                    </div>
                </Popconfirm>
            }

           

        </motion.div>

    );
}