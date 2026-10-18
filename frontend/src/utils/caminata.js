// funciones puras para mostrar y cargar los datos de la caminata

// la caminata se hace en argentina: la fecha se muestra siempre en esa zona horaria, la miren desde donde la miren
// asi el dia no se corre por la diferencia horaria de quien la carga ni de quien visita el sitio
const ZONA_HORARIA = "America/Argentina/Buenos_Aires";

// tope de fotos por edicion, es el mismo que valida la api
export const MAX_FOTOS = 30;

// formatea el dia en castellano, ej: "12 de abril de 2026"
export function formatearDia(fechaIso) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONA_HORARIA,
  }).format(new Date(fechaIso));
}

// pasa la fecha iso de la api al formato del input date, ej: "2026-04-12"
// se usa el locale en-CA porque escribe la fecha como aaaa-mm-dd, que es justo lo que entiende el input
export function diaParaInput(fechaIso) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: ZONA_HORARIA,
  }).format(new Date(fechaIso));
}

// pasa el valor del input date (ej: "2026-04-12") a iso, que es lo que espera la api
// se manda mediodia con offset -03:00 y no la medianoche utc, porque a esa hora en argentina todavia es el dia anterior
export function diaDesdeInput(valor) {
  return `${valor}T12:00:00-03:00`;
}

// texto con la cantidad de fotos de una edicion, ej: "Sin fotos", "1 foto", "12 fotos"
export function contarFotos(cantidad) {
  if (cantidad === 0) {
    return "Sin fotos";
  }
  return cantidad === 1 ? "1 foto" : `${cantidad} fotos`;
}
