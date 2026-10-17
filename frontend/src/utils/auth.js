// funciones puras para trabajar con el token jwt y los errores del login

// dice si el token todavia no vencio, leyendo el campo exp del payload (el payload se puede leer sin la clave, la firma es lo que no se puede falsificar)
export function tokenVigente(token) {
  try {
    // un jwt son tres partes separadas por punto: la del medio es el payload en base64url
    const payloadBase64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(payloadBase64));
    // exp viene en segundos y Date.now() en milisegundos
    return exp * 1000 > Date.now();
  } catch {
    // un token mal formado no sirve, lo tratamos como vencido
    return false;
  }
}

// texto en castellano para cada codigo de error del login; el mensaje de la api viene sin tildes, por eso lo armamos aca
export function mensajeErrorLogin(status) {
  if (status === 401) {
    return "El email o la contraseña no son correctos.";
  }
  if (status === 429) {
    return "Hiciste demasiados intentos fallidos. Probá de nuevo en 15 minutos.";
  }
  if (status === 400) {
    return "Revisá que el email y la contraseña estén bien escritos.";
  }
  return "Ocurrió un error inesperado. Intentá de nuevo en unos minutos.";
}
