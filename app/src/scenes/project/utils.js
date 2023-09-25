export function getDaysInMonth(month, year) {
  var date = new Date(year, month, 1);
  date.setHours(0, 0, 0, 0);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}
