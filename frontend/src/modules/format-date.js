/**
 * Function to format time based on the provided template.
 *
 * @param {number} inputDate - Date object.
 * @param {string} mask - Time formatting template. Supports the following tokens:
 *                        - yyyy: year (e.g., 2023)
 *                        - MM: month (01-12)
 *                        - MONTH: month abbreviation (e.g., Jan, Feb)
 *                        - dd: day of the month (01-31)
 *                        - HH: hour (00-23)
 *                        - mm: minute (00-59)
 *                        - ss: second (00-59)
 *                        - DDD: day of the week (e.g., Monday, Mon)
 * @returns {string} A string representing the formatted time according to the provided template.
 */

export function formatDate(inputDate, mask, timezone = 0) {
  let date = new Date(inputDate);

  let utc = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  let timezonedDate = new Date(utc.getTime() + timezone * 1000);
  date = timezonedDate;

  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek3leter = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthAbbr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const tokens = {
    yyyy: date.getFullYear(),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    MONTH: monthAbbr[date.getMonth()],
    dd: String(date.getDate()).padStart(2, '0'),
    HH: String(date.getHours()).padStart(2, '0'),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
    DAY: dayOfWeek[date.getDay()],
    DD: dayOfWeek3leter[date.getDay()]
  };

  let result = mask;
  for (const token in tokens) {
    result = result.replace(token, tokens[token]);
  }

  return result;
}
