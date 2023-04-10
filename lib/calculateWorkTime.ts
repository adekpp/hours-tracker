export function calculateWorkTime(
  startTime: string,
  endTime: string,
  breakDuration?: string
): string | null | Error {
  if (!startTime || !endTime) {
    return null;
  }

  const [startHours, startMinutes] = startTime.split(":");
  const [endHours, endMinutes] = endTime.split(":");
  const startDate = new Date(
    0,
    0,
    0,
    parseInt(startHours),
    parseInt(startMinutes)
  );
  const endDate = new Date(0, 0, 0, parseInt(endHours), parseInt(endMinutes));

  let workHoursInMs = endDate.getTime() - startDate.getTime();
  const breakDurationInMs = breakDuration
    ? parseInt(breakDuration) * 60 * 1000
    : 0;

  if (breakDurationInMs > workHoursInMs) {
    return new Error("Przerwa nie może być dłuższa niż czas pracy.");
  }

  workHoursInMs -= breakDurationInMs;

  const workHours = Math.floor(workHoursInMs / (60 * 60 * 1000));
  const workMinutes = Math.floor(
    (workHoursInMs % (60 * 60 * 1000)) / (60 * 1000)
  );

  return `${workHours}h ${workMinutes}m`;
}
