import { useState } from "react";
import estilos from "../styles/admin.module.css";
import CampoImagen from "./CampoImagen";

// formulario reutilizable para cada imagen configurable de la web
// un campo vacio quiere decir "sin foto": la landing muestra el bloque de color en su lugar
function PortadaForm({ campo, titulo, descripcion, imagenGuardada, enviando, onGuardar }) {
  const [imagen, setImagen] = useState(imagenGuardada);
  const [errorImagen, setErrorImagen] = useState("");

  function manejarEnvio(evento) {
    evento.preventDefault();
    if (imagen && !imagen.startsWith("data:image/")) {
      setErrorImagen("Seleccioná una imagen nueva para reemplazar la foto anterior.");
      return;
    }
    setErrorImagen("");
    onGuardar(imagen);
  }

  function quitar() {
    // confirm frena la accion hasta que la usuaria responda, para no sacar la foto por un clic de mas
    if (!window.confirm(`¿Querés sacar ${titulo.toLowerCase()}? La página va a mostrar un bloque de color en su lugar.`)) {
      return;
    }
    setImagen("");
    setErrorImagen("");
    onGuardar("");
  }

  return (
    <form onSubmit={manejarEnvio} className={estilos.tarjetaForm}>
      <h3 className={estilos.tituloForm}>{titulo}</h3>
      <p className={estilos.descripcion}>{descripcion} Elegí una imagen de hasta 4 MB.</p>

      <div className={estilos.formularioColumna}>
        {/* obligatorio false: se puede guardar vacio para sacar la foto */}
        <CampoImagen
          key={campo}
          valor={imagen}
          onChange={(valor) => {
            setImagen(valor);
            setErrorImagen("");
          }}
          etiqueta={titulo}
          obligatorio={false}
          horizontal
        />
        {errorImagen && <p className={estilos.errorImagen} role="alert">{errorImagen}</p>}
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
