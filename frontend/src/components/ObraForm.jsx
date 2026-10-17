import { useState } from "react";
import estilos from "../styles/admin.module.css";

// formulario de obra: sirve para crear (obra = null) y para editar (obra con datos)
// cada campo tiene su propio estado, y al enviar le pasa los datos juntos a onGuardar
function ObraForm({ obra, categorias, enviando, onGuardar, onCancelar }) {
  const [titulo, setTitulo] = useState(obra?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(obra?.descripcion ?? "");
  const [imagen, setImagen] = useState(obra?.imagen ?? "");
  // id de la categoria elegida; la obra que viene de la api trae la categoria completa, por eso se toma su _id
  const [categoria, setCategoria] = useState(obra?.categoria._id ?? "");
  const [imagenFalla, setImagenFalla] = useState(false);

  function cambiarImagen(evento) {
    setImagen(evento.target.value);
    // se vuelve a intentar mostrar la vista previa cada vez que cambia el link
    setImagenFalla(false);
  }

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

        <label className={estilos.campo}>
          Categoría
          <select
            value={categoria}
            onChange={(evento) => setCategoria(evento.target.value)}
            required
          >
            {/* opcion vacia y deshabilitada: obliga a elegir una de verdad y no deja guardar con la primera por descuido */}
            <option value="" disabled>
              Elegí una categoría
            </option>
            {categorias.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className={estilos.campo}>
          Imagen (link)
          <input
            type="url"
            value={imagen}
            onChange={cambiarImagen}
            placeholder="https://..."
            required
          />
        </label>

        {/* vista previa: ayuda a detectar un link roto antes de guardar */}
        {imagen.trim() && !imagenFalla && (
          <img
            src={imagen}
            alt="Vista previa de la imagen"
            className={estilos.vistaPrevia}
            onError={() => setImagenFalla(true)}
          />
        )}
        {imagen.trim() && imagenFalla && (
          <p className={estilos.pista}>
            No pudimos cargar la imagen. Revisá que el link sea correcto y que
            la imagen sea pública.
          </p>
        )}
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
