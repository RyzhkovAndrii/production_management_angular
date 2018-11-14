import * as moment from 'moment';

/**
 * @description immutable function
 * @returns new Date object with substructed days
 * @param date Date to substruct days
 * @param days numeric value of days to substruct
 */
export function substructDays(date: Date, days: number): Date {
  return moment(date).subtract(days, 'days').toDate();
}
/**
 * @description immutable function
 * @returns new Date object with added days
 * @param date Date to add days
 * @param days numeric value of days to add
 */
export function addDays(date: Date, days: number): Date {
  return moment(date).add(days, 'days').toDate();
}
/**
 * @description immutable function
 * @returns new Date object with time setted to midnight
 * @param date optional date value to get new Date from its value with resetted time to midnight,
 * if ommited returns current midnight date
 */
export function midnightDate(date ? : string | Date): Date {
  let result: Date;
  if (date) result = getDate(date);
  else result = new Date();
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * @description immutable function
 * @returns date object
 * @param date date in format DD-MM-YYYY
 */
export function getDate(date: string | Date, format = 'DD-MM-YYYY'): Date {
  return moment(date, format).toDate();
}

/**
 * @description immutable function
 * @returns string value of date in format dd-MM-YYYY
 */
export function formatDate(date: Date): string {
  return moment(date).format('DD-MM-YYYY');
}

/**
 * @description immutable function
 * @param date date string in format YYYY-MM-DD
 * @returns string value of date in format DD-MM-YYYY
 */
export function formatDateBrowserToServer(date: string | Date): string {
  return moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY').toString();
}

/**
 * @description immutable function
 * @param date string in format DD-MM-YYYY
 * @returns string value of date in format YYYY-MM-DD
 */
export function formatDateServerToBrowser(date: string | Date): string {
  return moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD').toString();
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
  if (result > length) {
    return -1;
  }
  return Math.round(result);
}

export function getDifferenceInDays(dateA: Date, dateB: Date) {
  const result = (midnightDate(dateA).getTime() - midnightDate(dateB).getTime()) / (24 * 60 * 60 * 1000);
  return Math.round(result);
}

export function getDateFirstDayOfMonth(date: Date) {
  return moment(date).date(1).toDate();
}

export function getDateLastDayOfMotth(date: Date) {
  const temp = moment(date);
  return temp.date(temp.daysInMonth()).toDate();
}

export function isSameMonthYear(a: Date, b: Date): boolean {
  return moment(a).isSame(b, 'month');
}

export function isSameDate(a: Date, b: Date): boolean {
  return moment(a).isSame(b, 'day');
}

export function isBeforeDate(value: string, date: string, valueFormat: string = 'YYYY-MM-DD', format: string = 'DD-MM-YYYY') {
  const aMoment = moment(value, valueFormat);
  const bMoment = moment(date, format);
  return aMoment.isBefore(bMoment);
}
