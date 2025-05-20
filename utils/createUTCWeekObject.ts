function getWeekRange(today = new Date()) {
  const day = today.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  const monday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + mondayOffset));
  monday.setUTCHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  sunday.setUTCHours(23, 59, 59, 999);

  return { monday, sunday };
}
export function createWeekObject(today = new Date()) {
  const { monday } = getWeekRange(today);
  const weekObj: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate() + i));
    weekObj[d.toISOString().substring(0, 10)] = 0;
  }
  return weekObj;
}

export function createLastWeekObject(): Record<string, number> {
  const today = new Date();
  const dayOfWeek = today.getUTCDay(); // 0 (Dom) - 6 (Sáb)
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  // Calcular lunes de la semana pasada en UTC
  const mondayLastWeek = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - daysSinceMonday - 7));

  const result: Record<string, number> = {};

  for (let i = 0; i < 7; i++) {
    const current = new Date(Date.UTC(mondayLastWeek.getUTCFullYear(), mondayLastWeek.getUTCMonth(), mondayLastWeek.getUTCDate() + i));
    const key = current.toISOString().substring(0, 10);
    result[key] = 0;
  }

  return result;
}