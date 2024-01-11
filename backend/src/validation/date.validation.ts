export function validateDate(dateString): boolean {
  const exceptionsWords = ['today', 'tomorrow']
  if (exceptionsWords.includes(dateString)) return true;
  const dateRegex = /^[0-9]{1,4}[-]{1}[0-9]{1,2}[-]{1}[0-9]{1,2}$/
  if (!dateRegex.test(dateString)) {
    return false;
  }
  const [yearStr, monthStr, dayStr] = dateString.split(/[-]/)
  const day = parseInt(dayStr);
  const month = parseInt(monthStr);
  const year = parseInt(yearStr);
  if (month < 1 || month > 12) {
    return false;
  }
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day < 1 || day > daysInMonth[month - 1]) {
    return false;
  }
  if (month === 2 && day === 29 && year % 4 !== 0) {
    return false;
  }
  return true;
}