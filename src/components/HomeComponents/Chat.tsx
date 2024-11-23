import { motion } from 'framer-motion';

interface ChatProps {
  message: string;       // Khai báo kiểu dữ liệu của props 'message' là string
  isMale: boolean;        // Khai báo kiểu dữ liệu của props 'isMale' là boolean
}

export default function Chat({ message, isMale }: ChatProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }} // Khởi tạo trạng thái ban đầu (mờ)
      animate={{ opacity: 1 }}  // Hiệu ứng khi phần tử xuất hiện (mờ dần)
      transition={{ duration: 0.5 }}  // Thời gian của hiệu ứng (0.5 giây)
    >
      {isMale && (
        <div className="bg-[#FFAF3A] max-[1500px]:text-sm max-[528px]:text-xs rounded-t-[20px] rounded-br-[20px] px-[5%] py-[4%] my-[5%] text-black font-Roboto font-bold">
          {message}
        </div>
      )}
      {!isMale && (
        <div className="bg-[#FFFFFF] max-[1500px]:text-sm max-[528px]:text-xs rounded-t-[20px] rounded-bl-[20px] px-[5%] py-[4%] my-[5%] text-black font-Roboto font-bold">
          {message}
        </div>
      )}
    </motion.div>
  );
}
