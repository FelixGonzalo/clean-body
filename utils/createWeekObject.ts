function getWeekRange(today = new Date()) {
  const day = today.getDay(); // 0 = domingo, 1 = lunes, ...
  const mondayOffset = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
}

export function createWeekObject(today = new Date()) {
  const { monday } = getWeekRange(today);
  const weekObj: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekObj[d.toISOString().substring(0, 10)] = 0;
  }
  return weekObj;
}

export function createLastWeekObject(): Record<string, number> {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const mondayLastWeek = new Date(today);
  mondayLastWeek.setDate(today.getDate() - daysSinceMonday - 7); // Ir al lunes pasado

  const result: Record<string, number> = {};

  for (let i = 0; i < 7; i++) {
    const current = new Date(mondayLastWeek);
    current.setDate(mondayLastWeek.getDate() + i);
    const key = current.toISOString().substring(0, 10);
    result[key] = 0;
  }

  return result;
}