import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Group } from "@mui/icons-material"; // Import axiosClient hoặc endpoint API của bạn
import { axiosClient } from "../../libraries/axiosClient";
import Loading from "../../pages/util/Loading";
import CircularLoading from "./CircularLoading";

interface User {
    id: string;
    name: string;
    imageUrl: string;
    userName: string;
}

interface FormData {
    roomName: string;
    friends: User[];
    description: string;
}

const AddUserToRoom = ({ onBack }: { onBack: () => void }) => {
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [groupUsers, setGroupUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // Người dùng đã lọc
    const [checkEmpty, setCheckEmpty] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        roomName: "",
        friends: [],
        description: "",

    });

    const isFirstRender = useRef(true); // Biến đánh dấu lần render đầu tiên
    const getUser = async () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axiosClient.get("/api/user", config);
        if (response.status === 200) {
            setUsers(response.data.result);
        }
        setIsLoading(false);
    }

    React.useEffect(() => {
        getUser();
    }, []);

    // Hàm tìm kiếm người dùng
    const handleSearch = () => {
        const result = users.filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        // Kiểm tra nếu không có kết quả
        if (result.length === 0) {
            setCheckEmpty(true);
        }
        else {
            setCheckEmpty(false);
        }

        setFilteredUsers(result);
    };

    // Tải danh sách người dùng khi nhập từ khóa tìm kiếm
    useEffect(() => {
        if (searchTerm) {
            handleSearch();
        } else {
            setFilteredUsers([]);
        }
    }, [searchTerm, users]);

    // Hàm thêm người dùng vào nhóm
    const addUserToGroup = (user: User) => {
        setGroupUsers((prev) => [...prev, user]);
        // cập nhật users bỏ người dùng đã thêm vào nhóm
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        
        // setSearchTerm(""); // Xóa input tìm kiếm sau khi thêm
    };

    // Hàm xóa người dùng khỏi nhóm
    const removeUserFromGroup = (userId: string) => {
        const removedUser = groupUsers.find((user) => user.id === userId);
    if (removedUser) {
        setGroupUsers((prev) => prev.filter((user) => user.id !== userId));
        // Thêm lại người dùng vào danh sách users
        setUsers((prev) => [...prev, removedUser]);

        // Nếu đang tìm kiếm, cập nhật lại danh sách filteredUsers
        if (searchTerm) {
            const result = [...users, removedUser].filter((user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(result);
        }
    }
    };

    // Thêm người dùng vào nhóm
    const addUsersToRoom = async () => {
        const token = localStorage.getItem("token");
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const idUser = groupUsers.map((user) => user.id);
        const data = {
            idRooms: formData.roomName, // Chắc chắn phòng (room) được xác định
            idUser: idUser,
            idPerAdd: "string", // Điều chỉnh tham số này cho đúng
        };

        try {
            const response = await axiosClient.post(
                "/api/Rooms-User/add-user-in-room",
                data,
                config
            );
            if (response.status === 200) {
                console.log("Add user to room successfully");
                // Reset thông tin sau khi thêm
                setGroupUsers([]);
                setFormData({ roomName: "", friends: [], description: "" });
            }
        } catch (error) {
            console.error("Failed to add user to room:", error);
        }
    };

    // Call API khi `idRoom` có giá trị
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (formData.roomName) {
            addUsersToRoom();
        }
    }, [formData.roomName]);

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 500,
                mx: "auto",
                mt: 2,
                p: 3,
                borderRadius: 2,
                bgcolor: "background.paper",
                boxShadow: 2,
            }}
        >

            <div className="p-6 w-[100%] max-w-lg mx-auto bg-white rounded-lg shadow-md mt-2">
                <input
                    type="text"
                    placeholder="Search friends to add"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 mb-4"
                />
                <div className="my-4">
                    {!isLoading && checkEmpty ? (
                        <div className="text-gray-500 text-sm">No users found</div>
                    ) : null}
                    {isLoading ? <CircularLoading /> : null}
                    {filteredUsers.length && searchTerm !== "" ? (
                        <div
                            className="max-h-20 overflow-y-auto"
                            style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 #f8fafc" }}
                        >
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <img
                                            src={user.imageUrl}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full mr-2"
                                        />
                                        <div>
                                            <span className="text-sm font-medium">{user.name}</span>
                                            <br />
                                            <span className="text-xs text-gray-500">{user.userName}</span>
                                        </div>
                                    </div>
                                    <Button onClick={() => addUserToGroup(user)} variant="outlined">
                                        Add
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 text-sm"></div>
                    )}
                </div>

            </div>

            {/* Danh sách người dùng đã chọn */}
            <div className="my-10">
                {groupUsers.length > 0 ? (
                    <div
                        className="max-h-20 overflow-y-auto"
                        style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 #f8fafc" }}
                    >
                        {groupUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <img
                                        src={user.imageUrl}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <div>
                                        <span className="text-sm font-medium">{user.name}</span>
                                        <br />
                                        <span className="text-xs text-gray-500">{user.userName}</span>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => removeUserFromGroup(user.id)}
                                    variant="outlined"
                                    color="error"
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 text-gray-500 text-sm">No users added yet</div>
                )}
            </div>


            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" color="secondary" onClick={onBack}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={groupUsers.length === 0}
                    onClick={addUsersToRoom}
                >
                    Add to Room
                </Button>
            </Box>
        </Box>
    );
};

export default AddUserToRoom;
