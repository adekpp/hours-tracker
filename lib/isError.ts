export function isError(value: Number | null | Error): value is Error {
  return value instanceof Error;
}
