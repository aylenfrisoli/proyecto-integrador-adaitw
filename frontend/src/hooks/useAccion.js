import { useState } from "react";

// maneja el estado de una accion del panel (crear, editar o borrar): si esta en curso y el aviso con el resultado
// alExito es opcional: se llama cuando la accion sale bien (ej: volver a pedir la lista)
function useAccion(alExito) {
  const [enviando, setEnviando] = useState(false);
  // { tipo: "exito" | "error", texto } o null
  const [mensaje, setMensaje] = useState(null);

  // corre la accion, muestra el resultado y devuelve true si salio bien
  // asi crear, editar y borrar no repiten el try/catch y quien llama sabe si tiene que cerrar el formulario
  async function ejecutar(accion, textoExito) {
    setEnviando(true);
    setMensaje(null);
    try {
      await accion();
      setMensaje({ tipo: "exito", texto: textoExito });
      alExito?.();
      return true;
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
      return false;
    } finally {
      setEnviando(false);
    }
  }

  const limpiarMensaje = () => setMensaje(null);

  return { ejecutar, enviando, mensaje, limpiarMensaje };
}

export default useAccion;
