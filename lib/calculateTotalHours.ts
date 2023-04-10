import { IDay } from "@/types";

export function calculateTotalHours(days: IDay[]) {
  let totalHoursInMs = 0;

  days.forEach((day) => {
    if (!day.hours) {
      return;
    }

    const [hours, minutes] = day.hours
      .split(" ")
      .filter((x) => x.length > 1)
      .map((x) => parseInt(x));

    totalHoursInMs += hours * 60 * 60 * 1000 + minutes * 60 * 1000;
  });

  const totalHours = Math.floor(totalHoursInMs / (60 * 60 * 1000));
  const totalMinutes = Math.floor(
    (totalHoursInMs % (60 * 60 * 1000)) / (60 * 1000)
  );
  if (totalHours === 0 && totalMinutes === 0) {
    return null;
  }
  return `${totalHours}h ${totalMinutes}m`;
}
