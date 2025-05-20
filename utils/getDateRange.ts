export const getUTCDateRange = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth(); // 0-indexed
  const day = now.getUTCDate();

  const start = new Date(Date.UTC(year, month, day, 0, 0, 0)).toISOString();
  const end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999)).toISOString();

  return {start, end}
}

export const getDateRange = () => {
  const today = new Date();
  const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  return {start, end}
}