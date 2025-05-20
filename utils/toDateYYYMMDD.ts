export const toUTCDateYYYYMMDD = (stringDate: string) => {
  const createdAt = new Date(stringDate);
  return `${createdAt.getUTCFullYear()}-${String(createdAt.getUTCMonth() + 1).padStart(2, '0')}-${String(createdAt.getUTCDate()).padStart(2, '0')}`;
}

export const toDateYYYYMMDD = (stringDate: string) => {
  const date = new Date(stringDate).toISOString().substring(0, 10);
  return date;
}