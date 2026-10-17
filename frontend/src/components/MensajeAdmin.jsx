import estilos from "../styles/admin.module.css";

// aviso con el resultado de una accion del panel; no muestra nada si no hay mensaje
function MensajeAdmin({ mensaje }) {
  if (!mensaje) {
    return null;
  }

  const esError = mensaje.tipo === "error";

  // role alert para los errores y status para los avisos: los lectores de pantalla los anuncian solos
  return (
    <p
      className={`${estilos.mensaje} ${esError ? estilos.error : estilos.exito}`}
      role={esError ? "alert" : "status"}
    >
      {mensaje.texto}
    </p>
  );
}

export default MensajeAdmin;
