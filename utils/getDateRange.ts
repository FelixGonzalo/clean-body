export const getDateRange = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth(); // 0-indexed
  const day = now.getUTCDate();

  const start = new Date(Date.UTC(year, month, day, 0, 0, 0)).toISOString();
  const end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999)).toISOString();

  return {start, end}
}