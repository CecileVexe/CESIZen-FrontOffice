export const parseStringDate = (date: string) => {
  const newDate = new Date(date);

  return newDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Paris",
  });
};
