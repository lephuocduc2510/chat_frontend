import React, { useState, useEffect } from "react";

interface EditMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: { id: string; content: string };
  onSave: (id: string, newMessage: string) => void;
}

const EditMessageModal: React.FC<EditMessageModalProps> = ({
  isOpen,
  onClose,
  message,
  onSave,
}) => {
  const [newMessage, setNewMessage] = useState(message.content);

  // Cập nhật state khi props thay đổi
  useEffect(() => {
    setNewMessage(message.content);
  }, [message]);

  const handleSave = () => {
    
    onSave(message.id, newMessage); // Gọi hàm onSave với ID và tin nhắn mới
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-lg shadow-md w-80"
        onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click thoát modal
      >
        <h3 className="text-lg font-bold mb-3">Sửa tin nhắn</h3>
        <textarea
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows={4}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="py-1 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="py-1 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleSave}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMessageModal;
