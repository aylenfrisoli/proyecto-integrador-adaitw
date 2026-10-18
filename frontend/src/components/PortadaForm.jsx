import { useState } from "react";
import estilos from "../styles/admin.module.css";
import CampoImagen from "./CampoImagen";

// formulario de la portada: un solo campo con el link de la foto
// un campo vacio quiere decir "sin foto": la landing muestra un bloque de color en su lugar
function PortadaForm({ imagenGuardada, enviando, onGuardar }) {
  const [imagen, setImagen] = useState(imagenGuardada);

  function manejarEnvio(evento) {
    evento.preventDefault();
    onGuardar(imagen);
  }

  function quitar() {
    // confirm frena la accion hasta que la usuaria responda, para no sacar la foto por un clic de mas
    if (!window.confirm("¿Querés sacar la foto de la portada? La página va a mostrar un bloque de color en su lugar.")) {
      return;
    }
    setImagen("");
    onGuardar("");
  }

  return (
    <form onSubmit={manejarEnvio} className={estilos.tarjetaForm}>
      <h3 className={estilos.tituloForm}>Foto de la portada</h3>

      <div className={estilos.formularioColumna}>
        {/* obligatorio false: se puede guardar vacio para sacar la foto */}
        <CampoImagen
          valor={imagen}
          onChange={setImagen}
          etiqueta="Foto de la portada (link)"
          obligatorio={false}
          horizontal
        />
      </div>

      <div className={`${estilos.acciones} ${estilos.accionesForm}`}>
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          Guardar foto
        </button>
        {/* el boton de quitar solo aparece si hay una foto guardada */}
        {imagenGuardada && (
          <button type="button" className="btn btn-outline" onClick={quitar} disabled={enviando}>
            Quitar foto
          </button>
        )}
      </div>
    </form>
  );
}

export default PortadaForm;
