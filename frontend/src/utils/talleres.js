// funciones puras para mostrar los datos de un taller

// textos que se muestran por cada valor de modalidad y de estado que manda la api
export const ETIQUETAS_MODALIDAD = {
  presencial: "Presencial",
  virtual: "Virtual",
};

export const ETIQUETAS_ESTADO = {
  abierto: "Inscripción abierta",
  completo: "Cupo completo",
  finalizado: "Finalizado",
};

// formatea la fecha en castellano, ej: "sábado, 31 de octubre"
// la api manda la fecha en utc y el navegador la muestra en la hora local de quien mira
export function formatearFecha(fechaIso) {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(fechaIso));
}

// formatea solo la hora, ej: "18:30"
export function formatearHora(fechaIso) {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(fechaIso));
}

// ordena para la landing: primero los que todavia sirven, del mas proximo al mas lejano, y al final los finalizados, del mas reciente al mas viejo
export function ordenarTalleres(talleres) {
  // filter devuelve un array nuevo, asi que sort no modifica el array original
  const vigentes = talleres
    .filter((taller) => taller.estado !== "finalizado")
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const finalizados = talleres
    .filter((taller) => taller.estado === "finalizado")
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  return [...vigentes, ...finalizados];
}

// mensaje de whatsapp para inscribirse a un taller
export function armarMensajeTaller(taller) {
  return `Hola Sara! Quiero inscribirme al taller "${taller.titulo}". ¿Me pasás los detalles?`;
}
