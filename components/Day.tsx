import { motion } from "framer-motion";
import { IDay } from "@/types";
import { useState } from "react";
import Modal from "./Modal";
import { calculateHours } from "@/lib/calculateHours";

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
      className={`flex h-[100px] w-full cursor-pointer  flex-col items-center justify-center rounded-md bg-slate-200 p-3 text-neutral-900 shadow-md hover:bg-slate-300 md:max-w-[136px] ${
        (day.leaveType === "vacations" && "border-[3px] border-yellow-400") ||
        (day.leaveType === "sickLeave" && "border-[3px] border-yellow-400") ||
        (day.businessTrip && "border-[3px] border-blue-400")
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
        <p className="text-2xl">{new Date(day.date).getDate()}</p>
        <p className="text-xs">{day.dayName}</p>
        {day.leaveType && (
          <p className="text-xs text-red-500">
            {day.leaveType === "sickLeave" ? "Zwolnienie lekarskie" : "Urlop"}
          </p>
        )}
        <p className="text-xs font-semibold">{calculateHours(day)}</p>
      </div>

      <Modal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        day={day}
      />
    </motion.div>
  );
}
