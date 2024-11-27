import React from 'react';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { motion } from 'framer-motion';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { NavLink } from 'react-router-dom';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import InsertChartOutlinedTwoToneIcon from '@mui/icons-material/InsertChartOutlinedTwoTone';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InfoIcon from '@mui/icons-material/Info';
import { PersonOutline, RoomOutlined } from '@mui/icons-material';

// Array chứa các icon component
const iconComponent = [
  <RoomOutlined />,
  <PersonOutline />,
  <InfoIcon />,
  <SettingsOutlinedIcon />
];

// Định nghĩa interface cho các props
interface ItemProps {
  text: string; // Văn bản hiển thị
  to: string;   // Đường dẫn dẫn đến
  val: number;  // Index để lấy icon từ `iconComponent`
}

const Item: React.FC<ItemProps> = ({ text, to, val }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Bắt đầu từ trạng thái mờ và dịch chuyển
      animate={{ opacity: 1, y: 0 }} // Hiện lên hoàn toàn và trở về vị trí ban đầu
      exit={{ opacity: 0, y: -20 }}  // Thoát với hiệu ứng dịch ngược
      transition={{ duration: 0.3 }} // Thời gian cho hiệu ứng
    >
      <NavLink
        to={to}
        style={(value: { isActive: boolean }): React.CSSProperties =>
          value.isActive
            ? { backgroundColor: '#0147FF', color: 'white' }
            : {}
        }
        className='w-[80%] max-[1250px]:text-sm max-[1024px]:my-4 max-[1024px]:justify-center max-[1024px]:items-center max-[1024px]:py-[6%] transition ease-in-out delay-250 flex flex-row px-[6%] py-[3%] rounded-lg my-[10%]'
      >
        {iconComponent[val]} {/* Lấy icon dựa trên val */}
        <div className="max-[1024px]:hidden ml-[12%]">{text}</div>
      </NavLink>
    </motion.div>
  );
};

export default Item;
