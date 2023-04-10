import { motion } from "framer-motion";
import { getFirstNonZeroDigit } from "@/lib/getFirstNonZeroDigit";
import { IDay } from "@/types";
import { Fragment, useState } from "react";
import Modal from "./Modal";

type DayProps = {
  day: IDay;
};

export default function Day({ day }: DayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDayClick = () => {
    setIsModalOpen(true);
  };

  return (
    <motion.div
      className={`flex max-h-[100px] min-h-[100px] max-w-[100px] cursor-pointer flex-col items-center justify-center rounded-md bg-slate-200 p-3 text-neutral-900 shadow-md hover:bg-slate-300  ${
        day.leaveType && "border-[2px] border-red-500"
      }`}
      onClick={handleDayClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className={`text-center tracking-wider ${
          day.dayName === "Niedziela" && "text-red-500"
        } `}
      >
        <p className="text-2xl">{getFirstNonZeroDigit(day.date)}</p>
        <p className="text-xs">{day.dayName}</p>
        {day.leaveType && (
          <p className="text-xs text-red-500">
            {day.leaveType === "sickLeave" ? "Zwolnienie lekarskie" : "Urlop"}
          </p>
        )}
        <p className="text-xs">{day.hours}</p>
      </div>

      <Modal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        day={day}
      />
    </motion.div>
  );
}
