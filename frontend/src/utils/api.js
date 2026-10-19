// funciones puras para convertir las respuestas de error de la api en textos para mostrar en el panel

// pone la primera letra en mayuscula y cierra con punto; la api manda sus mensajes en minuscula y sin punto
export function capitalizar(texto) {
  const conMayuscula = texto.charAt(0).toUpperCase() + texto.slice(1);
  return /[.!?]$/.test(conMayuscula) ? conMayuscula : `${conMayuscula}.`;
}

// arma el mensaje segun el codigo de estado; datos es el json del error (puede ser null si no habia cuerpo)
export function mensajeErrorApi(status, datos) {
  // 400 con detalle por campo (validacion de zod): se muestran todos juntos
  if (status === 400 && Array.isArray(datos?.errores) && datos.errores.length > 0) {
    return datos.errores.map((error) => capitalizar(error.mensaje)).join(" ");
  }

  // 413 = el envio pasa el limite del servidor (10 MB entre todas las imagenes)
  if (status === 413) {
    return "Las imágenes pesan demasiado en total (máximo 10 MB por envío). Probá con archivos más livianos.";
  }

  if (status === 404) {
    return "No encontramos ese registro, puede que ya se haya borrado.";
  }

  // en 400 y 409 la api explica el motivo (ej: "ya existe un registro con ese nombre"), asi que se muestra
  if ((status === 400 || status === 409) && datos?.message) {
    return capitalizar(datos.message);
  }

  return "Ocurrió un error inesperado. Intentá de nuevo en unos minutos.";
}
