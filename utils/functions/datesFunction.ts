import {
  startOfWeek,
  startOfMonth,
  startOfYear,
  addWeeks,
  addMonths,
  addYears,
  isAfter,
} from "date-fns";

export const parseStringDate = (date: string) => {
  const newDate = new Date(date);

  return newDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const parseStringHour = (date: string) => {
  const newDate = new Date(date);

  return newDate.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const checkCanGoNext = (date: Date, period: string): boolean => {
  let nextPeriodStart: Date;

  switch (period) {
    case "week":
      nextPeriodStart = startOfWeek(addWeeks(date, 1), { weekStartsOn: 1 }); // lundi suivant
      break;
    case "month":
      nextPeriodStart = startOfMonth(addMonths(date, 1)); // 1er du mois suivant
      break;
    case "year":
      nextPeriodStart = startOfYear(addYears(date, 1)); // 1er janvier de l'année suivante
      break;
    default:
      throw new Error(`Période invalide : ${period}`);
  }

  return !isAfter(nextPeriodStart, new Date());
};
