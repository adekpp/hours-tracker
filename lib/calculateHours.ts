import { IDay } from "@/types";

export function calculateHours(days: IDay | IDay[]) {
  let totalMinutes = 0;

  const dayList = Array.isArray(days) ? days : [days];

  dayList.forEach((day) => {
    const hoursArray = Array.isArray(day.hours) ? day.hours : [day.hours];

    hoursArray.forEach((hours) => {
      const minutes = typeof hours === "number" && !isNaN(hours) ? hours : 0;
      totalMinutes += minutes;
    });
  });

  if (totalMinutes === 0) {
    return null;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const formattedTime = `${hours}h ${minutes}m`;

  return formattedTime;
}
