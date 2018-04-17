/**
 * @description immutable function
 * @returns new Date object with substructed days
 * @param date Date to substruct days
 * @param days numeric value of days to substruct
 */
export function substructDays(date: Date, days: number): Date {
  const result: Date = this.midnightDate();
  result.setTime(date.getTime() - (24*60*60*1000)*days);
  return result;
}
/**
 * @description immutable function
 * @returns new Date object with added days
 * @param date Date to add days
 * @param days numeric value of days to add
 */
export function addDays(date: Date, days: number): Date {
  const result: Date = this.midnightDate();
  result.setTime(date.getTime() + (24*60*60*1000)*days);
  return result;
}
/**
 * @description immutable function
 * @returns new Date object with time setted to midnight
 * @param date optional date value to get new Date from its value with resetted time to midnight,
 * if ommited returns current midnight date
 */
export function midnightDate(date?: string | Date): Date {
  let result: Date;
  if (date) result = new Date(date.toString())
  else result = new Date();
  result.setHours(0, 0, 0, 0);
  return result;
}
/**
 * @description immutable function
 * @returns string value of date in format YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().substring(0, 10);
}
/**
 * @description immutable function
 * @returns an index of element by date in array with constant difference in milliseconds of array's elements
 * @param date date of current element to get index
 * @param length length of the array in which element will be placed
 * @param period a numeric value in milliseconds for constant period between elements
 * @param endingDate date of last element in array
 */
export function getIndex(date: Date, length: number, period: number, endingDate: Date): number {
  const max = midnightDate(endingDate).getTime();
  const result = length - ((max - midnightDate(date).getTime()) / period + 1);
  return Math.round(result);
}
