export const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  // Formatea en la zona horaria del usuario
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
