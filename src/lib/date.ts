export const getDateString = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/${year}`;
};

export const getDateInputString = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const d = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  return d;
};

export const getDifferenceFromNow = (date: Date) => {
  const target = date.getTime();
  const now = Date.now();

  return now - target;
};

export const formatDateAtTime = (date: Date) => {
  const d = date.getDate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const m = months[date.getMonth()];
  const y = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${d} ${m} ${y} @ ${hours}:${minutes} ${ampm}`;
};

export const formatDayDate = (date: Date) => {
  const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = dayOfWeek[date.getDay()];
  const d = date.getDate();
  const m = months[date.getMonth()];
  const y = date.getFullYear();

  return `${day}, ${d} ${m} ${y}`;
};

export const formatTimeAmPm = (date: Date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours}:${minutes} ${ampm}`;
};

export const getWeekNumber = (date: Date) => {
  const dateObj = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  dateObj.setUTCDate(dateObj.getUTCDate() + 4 - (dateObj.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(dateObj.getUTCFullYear(), 0, 1));

  return Math.ceil(
    ((dateObj.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
};
