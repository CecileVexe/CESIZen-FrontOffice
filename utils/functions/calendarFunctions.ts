export const formatDateKey = (date: string | Date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // "2025-03-01"
};
