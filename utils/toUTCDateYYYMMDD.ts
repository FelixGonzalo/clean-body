export const toUTCDateYYYYMMDD = (stringDate: string) => {
  const createdAt = new Date(stringDate);
  return `${createdAt.getUTCFullYear()}-${String(createdAt.getUTCMonth() + 1).padStart(2, '0')}-${String(createdAt.getUTCDate()).padStart(2, '0')}`;
}