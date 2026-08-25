export const obtenerRangoMesActual = () => {
    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = hoy.getMonth() + 1;
    const dia = hoy.getDate();

    return {
      fechaInicial: `${anio}-${String(mes).padStart(2, "0")}-01`,
      fechaFinal: `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`,
    };
  };