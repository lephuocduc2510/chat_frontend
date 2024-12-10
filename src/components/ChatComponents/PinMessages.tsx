import React from "react";
import { Avatar } from "@mui/material";
import { motion } from "framer-motion";

interface PinnedMessagesProps {
    values: {
        content: string;
        name: string;
        sentAt: string;
        pic: string;
    };
}

const PinnedMessages: React.FC<PinnedMessagesProps> = ({ values }) => (
    <motion.div
        className="flex items-center py-1 px-2 mt-1 cursor-pointer hover:bg-gray-100 rounded-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
    >
        <Avatar
            alt={values.name}
            src={values.pic}
            style={{ width: 36, height: 36 }}
        />
        <div className="ml-2 flex-1">
            <div className="text-sm font-medium truncate">{values.content}</div>
            <div className="text-xs text-gray-500">{values.name}</div>
        </div>
        <div className="text-xs text-gray-400">{values.sentAt}</div>
    </motion.div>
);

export default PinnedMessages;
