export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber || phoneNumber.length !== 11) {
    return phoneNumber;
  }
  return `${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4)}`;
}

export function getOrdinal(number) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = number % 100;
  return number + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}

export function formatDate(utcDateString) {
  if (!utcDateString) return '';

  const localDate = new Date(utcDateString);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const day = localDate.getDate();
  const month = months[localDate.getMonth()];
  const year = localDate.getFullYear();

  const ordinalSuffix = d => {
    if (d % 10 === 1 && d !== 11) return 'st';
    if (d % 10 === 2 && d !== 12) return 'nd';
    if (d % 10 === 3 && d !== 13) return 'rd';
    return 'th';
  };

  return `${day}${ordinalSuffix(day)} ${month}, ${year}`;
}
