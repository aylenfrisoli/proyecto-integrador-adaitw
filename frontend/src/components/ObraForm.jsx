import { useState } from "react";
import estilos from "../styles/admin.module.css";
import CampoImagen from "./CampoImagen";
import SelectCategoria from "./SelectCategoria";

// formulario de obra: sirve para crear (obra = null) y para editar (obra con datos)
// cada campo tiene su propio estado, y al enviar le pasa los datos juntos a onGuardar
function ObraForm({ obra, categorias, enviando, onGuardar, onCancelar }) {
  const [titulo, setTitulo] = useState(obra?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(obra?.descripcion ?? "");
  const [imagen, setImagen] = useState(obra?.imagen ?? "");
  // id de la categoria elegida; la obra que viene de la api trae la categoria completa, por eso se toma su _id
  const [categoria, setCategoria] = useState(obra?.categoria._id ?? "");

  function manejarEnvio(evento) {
    evento.preventDefault();
    onGuardar({ titulo, descripcion, imagen, categoria });
  }

  return (
    <form onSubmit={manejarEnvio} className={estilos.tarjetaForm}>
      <h3 className={estilos.tituloForm}>{obra ? "Editar obra" : "Nueva obra"}</h3>

      <div className={estilos.formularioColumna}>
        <label className={estilos.campo}>
          Título
          <input
            type="text"
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
            maxLength={100}
            required
          />
        </label>

        <label className={estilos.campo}>
          Descripción
          <textarea
            value={descripcion}
            onChange={(evento) => setDescripcion(evento.target.value)}
            maxLength={1000}
            required
          />
        </label>

        <SelectCategoria
          valor={categoria}
          onChange={setCategoria}
          categorias={categorias}
        />

        <CampoImagen valor={imagen} onChange={setImagen} />
      </div>

      <div className={`${estilos.acciones} ${estilos.accionesForm}`}>
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {obra ? "Guardar cambios" : "Crear obra"}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default ObraForm;
