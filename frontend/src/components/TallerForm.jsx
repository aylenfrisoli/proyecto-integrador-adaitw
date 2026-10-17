import { useState } from "react";
import estilos from "../styles/admin.module.css";
import {
  ETIQUETAS_ESTADO,
  ETIQUETAS_MODALIDAD,
  fechaDesdeInput,
  fechaParaInput,
} from "../utils/talleres";

// formulario de taller: sirve para crear (taller = null) y para editar (taller con datos)
function TallerForm({ taller, enviando, onGuardar, onCancelar }) {
  const [titulo, setTitulo] = useState(taller?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(taller?.descripcion ?? "");
  const [fecha, setFecha] = useState(taller ? fechaParaInput(taller.fecha) : "");
  const [modalidad, setModalidad] = useState(taller?.modalidad ?? "presencial");
  // un taller virtual no trae direccion, por eso el ""
  const [direccion, setDireccion] = useState(taller?.direccion ?? "");
  const [estado, setEstado] = useState(taller?.estado ?? "abierto");

  const esPresencial = modalidad === "presencial";

  function manejarEnvio(evento) {
    evento.preventDefault();
    onGuardar({
      titulo,
      descripcion,
      // la api espera la fecha en iso (utc), asi no hay lios de zona horaria
      fecha: fechaDesdeInput(fecha),
      modalidad,
      // en los virtuales no se manda: undefined no sale en el json y la api borra la direccion vieja
      direccion: esPresencial ? direccion : undefined,
      estado,
    });
  }

  return (
    <form onSubmit={manejarEnvio} className={estilos.tarjetaForm}>
      <h3 className={estilos.tituloForm}>
        {taller ? "Editar taller" : "Nuevo taller"}
      </h3>

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
          Fecha y hora
          <input
            type="datetime-local"
            value={fecha}
            onChange={(evento) => setFecha(evento.target.value)}
            required
          />
        </label>

        <label className={estilos.campo}>
          Modalidad
          <select
            value={modalidad}
            onChange={(evento) => setModalidad(evento.target.value)}
          >
            {Object.entries(ETIQUETAS_MODALIDAD).map(([valor, etiqueta]) => (
              <option key={valor} value={valor}>
                {etiqueta}
              </option>
            ))}
          </select>
        </label>

        {/* la direccion solo existe en los presenciales, por eso se oculta si es virtual */}
        {esPresencial && (
          <label className={estilos.campo}>
            Dirección
            <input
              type="text"
              value={direccion}
              onChange={(evento) => setDireccion(evento.target.value)}
              maxLength={200}
              placeholder="Ej: Costanera 1234, San Bernardo del Tuyú"
              required
            />
          </label>
        )}

        <label className={estilos.campo}>
          Estado
          <select
            value={estado}
            onChange={(evento) => setEstado(evento.target.value)}
          >
            {Object.entries(ETIQUETAS_ESTADO).map(([valor, etiqueta]) => (
              <option key={valor} value={valor}>
                {etiqueta}
              </option>
            ))}
          </select>
          <span className={estilos.pista}>
            El botón de WhatsApp para inscribirse solo aparece si la inscripción
            está abierta.
          </span>
        </label>
      </div>

      <div className={`${estilos.acciones} ${estilos.accionesForm}`}>
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {taller ? "Guardar cambios" : "Crear taller"}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default TallerForm;
