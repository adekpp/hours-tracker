import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns";
import pl from "date-fns/locale/pl";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { IDay } from "@/types";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";

type Props = {
  days: IDay[];
  onFilter: (filteredDays: IDay[]) => void;
};

export const DayPicker = ({ days, onFilter }: Props) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  useEffect(() => {
    if (days.length < 1) return;
    const filteredData = (() => {
      if (!startDate && !endDate) return days;
      return days?.filter((day: IDay) => {
        const itemDate = new Date(day.date);
        const isAfterStartDate = !startDate || itemDate >= startDate;
        const isBeforeEndDate = !endDate || itemDate <= endDate;
        return isAfterStartDate && isBeforeEndDate;
      });
    })();
    onFilter(filteredData);
  }, [days, startDate, endDate, onFilter]);

  if (!days) return null;
  return (
    <div className="flex w-full flex-col place-items-center md:place-items-start">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={`flex w-full max-w-[288px] items-center justify-center rounded-md bg-teal-900 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75  ${
                open && "bg-gradient-to-b from-teal-900 to-teal-700"
              }`}
            >
              <span>Filtruj</span>
              <ChevronDownIcon
                className={`${
                  open ? "rotate-180 transform transition-transform" : ""
                } h-5 w-5 `}
              />
            </Disclosure.Button>
            <Disclosure.Panel>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: open ? "auto" : 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 flex flex-col items-center  space-y-3 text-neutral-800 md:flex-row md:place-content-center md:items-center md:space-y-0 md:space-x-3"
              >
                <div className="relative flex flex-row items-center space-x-2">
                  <label className="font-thin  text-white drop-shadow-md">
                    Od:
                  </label>
                  <DatePicker
                    dateFormat={"dd.MM.yyyy"}
                    selected={startDate}
                    onChange={handleStartDateChange}
                    minDate={new Date(days[0]?.date)}
                    maxDate={new Date(days[days.length - 1]?.date)}
                    locale={pl}
                    className="rounded-md  bg-white py-1 pl-2 drop-shadow-md"
                  />
                  {startDate && (
                    <button onClick={() => handleStartDateChange(null)}>
                      <XCircleIcon className="absolute top-[7px] right-[12px] h-5 w-5 " />
                    </button>
                  )}
                </div>
                <div className="relative flex flex-row items-center space-x-2 ">
                  <label className=" font-thin text-white drop-shadow-md">
                    Do:
                  </label>
                  <DatePicker
                    dateFormat={"dd.MM.yyyy"}
                    selected={endDate}
                    onChange={handleEndDateChange}
                    minDate={new Date(days[0]?.date)}
                    maxDate={new Date(days[days.length - 1]?.date)}
                    locale={pl}
                    className="rounded-md  bg-white py-1 pl-2 drop-shadow-md"
                  />
                  {endDate && (
                    <button onClick={() => handleEndDateChange(null)}>
                      <XCircleIcon className="absolute top-[7px] right-[12px] h-5 w-5 " />
                    </button>
                  )}
                </div>
              </motion.div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};
