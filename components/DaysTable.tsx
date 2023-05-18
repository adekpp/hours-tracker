import React from "react";
import type { IDay } from "@/types";

interface CustomTableProps {
  daysInMonth: IDay[];
  dailyNormHours: number | string;
}

export const getHours = (hours: number, hoursNorm = 8, isWeekend: boolean) => {
  const minutesNorm = hoursNorm * 60;

  let workTime = 0;
  let overTime = 0;
  if (isWeekend) {
    overTime = hours;
  }
  else {
    if (hours > minutesNorm) {
      workTime = minutesNorm;
      overTime = hours - minutesNorm;
    } else {
      workTime = hours;
    }
  }

  const formattedWorkTime = formatTime(workTime);
  const formattedOverTime = formatTime(overTime);

  return { workTime: formattedWorkTime, overTime: formattedOverTime };
};

const formatTime = (time: number) => {
  let hours = Math.floor(time / 60);
  let minutes = time % 60;
  if (hours === 0 && minutes === 0) {
    return null
  }
  return `${hours}h ${minutes}m`;

};

const getRowBg = (day: IDay) => {
  if (day.businessTrip) {
    return "bg-blue-400";
  } else if (day.leaveType === "vacations" || day.leaveType === "sickLeave") {
    return "bg-yellow-400";
  } else {
    return "bg-white";
  }
};

export const DaysTable = ({
  daysInMonth,
  dailyNormHours,
}: CustomTableProps) => {
  const days = daysInMonth.filter((day) => day.hours || day.leaveType);

  const renderTableHead = () => (
    <thead>
      <tr className="text-teal-900">
        <th className="rounded-tl-md bg-white p-2">Data</th>
        <th className="hidden bg-white p-2 md:table-cell">Dzień</th>
        <th className="bg-white p-2">Godziny</th>
        <th className="rounded-tr-md bg-white p-2">Nadgodziny</th>
      </tr>
    </thead>
  );

  const renderDayTable = (day: IDay) => {
    const isWeekend = day.dayName === "Sobota" || day.dayName === "Niedziela";
    const { workTime, overTime } = getHours(
      day.hours as number,
      dailyNormHours as number,
      isWeekend
    );
    const rowBg = getRowBg(day);
    return (
      <tr
        key={day.id}
        className={`text-slate-900 ${
          day.dayName === "Niedziela" && "text-red-600"
        } ${rowBg}`}
      >
        <td className="border-[2px] border-teal-600 p-2">
          {new Date(day.date).toLocaleDateString()}
        </td>
        <td
          className={`hidden border-[2px] border-teal-600 p-2  md:table-cell md:w-full ${
            day.dayName === "Niedziela" && "text-red-600"
          }`}
        >
          {day.dayName}
        </td>
        <td className="border-[2px] border-teal-600 p-2">
          {day.leaveType === "vacations"
            ? "Urlop"
            : day.leaveType === "sickLeave"
            ? "Zwolnienie"
            : workTime}
        </td>
        <td className="border-[2px] border-teal-600 p-2">{overTime || "" }</td>
      </tr>
    );
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-1 flex place-content-around rounded-md bg-teal-800 px-2 py-1 text-xs sm:text-base">
        <div>
          <span className="mr-1 inline-block h-3 w-3 bg-yellow-400" />
          <p className="inline-block text-white">
            {" "}
            - Urlop / zwolnienie lekarskie
          </p>
        </div>
        <div>
          <span className="mr-1 inline-block h-3 w-3 bg-blue-400" />
          <p className="inline-block text-white"> - Delegacja</p>
        </div>
      </div>
      <div className="grid grid-cols-1 place-items-center gap-2">
        {typeof dailyNormHours === "number" && (
          <table className="w-full max-w-lg table-auto">
            {renderTableHead()}
            <tbody>{days.map((day) => renderDayTable(day))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
};
