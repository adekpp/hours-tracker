export function isError(value: string | null | Error): value is Error {
  return value instanceof Error;
}
