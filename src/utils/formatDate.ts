export const formatDate = (dateString: string,ocultarFechas: boolean = false) => {
  const date = new Date(dateString);

  if (ocultarFechas) {
    return date.toISOString().substring(0, 10);
  }

  return date.toLocaleString();
};