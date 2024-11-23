import React from 'react'
import { BsCheckCircleFill } from 'react-icons/bs'

// Định nghĩa kiểu cho các props của Card
interface CardProps {
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ title, description }) => {
  return (
    <div className="flex flex-row gap-2 w-[80%]">
      <div className="mt-1">
        <BsCheckCircleFill color="#56D12C" fontSize={22} />
      </div>
      <div>
        <div className="font-Roboto font-semibold text-lg sm:text-xl">{title}</div>
        <div className="mt-[2%] font-Roboto text-base sm:text-lg">{description}</div>
      </div>
    </div>
  )
}

export default Card;
