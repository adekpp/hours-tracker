export function calculateWorkTime(
  startTime: Date,
  endTime: Date,
  breakDuration = 0
): number {

  const startMs = startTime.getTime();
  const endMs = endTime.getTime();
  const diffMs = endMs - startMs;
  const breakMs = breakDuration * 60 * 1000;

  const workMs = diffMs - breakMs;
  const workMinutes = Math.floor(workMs / (60 * 1000));
  return workMinutes; //work time in minutes
}
