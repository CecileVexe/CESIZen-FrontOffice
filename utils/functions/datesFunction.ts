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
