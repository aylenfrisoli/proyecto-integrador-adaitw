import { useState } from "react";
import useAccion from "../hooks/useAccion";
import useApi from "../hooks/useApi";
import useFetch from "../hooks/useFetch";
import estilos from "../styles/admin.module.css";
import {
  ETIQUETAS_ESTADO,
  ETIQUETAS_MODALIDAD,
  formatearFecha,
  formatearHora,
} from "../utils/talleres";
import EstadoDeDatos from "./EstadoDeDatos";
import MensajeAdmin from "./MensajeAdmin";
import TallerForm from "./TallerForm";

// panel de talleres: igual que el de productos pero sin categoria ni imagen
function TalleresAdmin() {
  const { data: talleres, loading, error, recargar } = useFetch("/talleres");
  const { pedir } = useApi();
  const { ejecutar, enviando, mensaje, limpiarMensaje } = useAccion(recargar);

  // null = formulario cerrado; { taller: null } = taller nuevo; { taller } = editando ese taller
  const [formulario, setFormulario] = useState(null);

  // mientras no llegan los datos es null, por eso un array vacio para no romper el map
  const lista = talleres ?? [];

  function abrirFormulario(taller) {
    limpiarMensaje();
    setFormulario({ taller });
  }

  // crea o edita segun el formulario tenga un taller o no; si sale bien lo cierra
  async function guardar(datos) {
    const editando = formulario.taller;
    const ok = await ejecutar(
      () =>
        editando
          ? pedir(`/talleres/${editando._id}`, { metodo: "PUT", cuerpo: datos })
          : pedir("/talleres", { metodo: "POST", cuerpo: datos }),
      editando ? "Taller actualizado." : "Taller creado.",
    );
    if (ok) setFormulario(null);
  }

  async function borrar(taller) {
    // confirm frena la accion hasta que la usuaria responda, para no borrar por un clic de mas
    if (!window.confirm(`¿Querés borrar el taller "${taller.titulo}"?`)) {
      return;
    }
    await ejecutar(
      () => pedir(`/talleres/${taller._id}`, { metodo: "DELETE" }),
      "Taller borrado.",
    );
  }

  return (
    <section className={`container ${estilos.seccion}`}>
      <h2 className={`display-title ${estilos.titulo}`}>Talleres</h2>
      <p className={estilos.descripcion}>
        Los talleres que dictás. Los presenciales llevan dirección y la
        inscripción se hace por WhatsApp mientras estén abiertos.
      </p>

      <div className={estilos.barraLista}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => abrirFormulario(null)}
          disabled={formulario !== null}
        >
          Nuevo taller
        </button>
      </div>

      <MensajeAdmin mensaje={mensaje} />

      {/* la key hace que el formulario se reinicie al pasar de editar un taller a otro */}
      {formulario && (
        <TallerForm
          key={formulario.taller?._id ?? "nuevo"}
          taller={formulario.taller}
          enviando={enviando}
          onGuardar={guardar}
          onCancelar={() => setFormulario(null)}
        />
      )}

      <EstadoDeDatos
        loading={loading}
        error={error}
        vacio={lista.length === 0}
        textoVacio="Todavía no cargaste ningún taller."
      >
        <ul className={estilos.lista}>
          {lista.map((taller) => (
            <li key={taller._id} className={estilos.fila}>
              <div>
                <span className={estilos.nombre}>{taller.titulo}</span>
                <span className={estilos.metadato}>
                  {formatearFecha(taller.fecha)}, {formatearHora(taller.fecha)} hs ·{" "}
                  {ETIQUETAS_MODALIDAD[taller.modalidad]} ·{" "}
                  {ETIQUETAS_ESTADO[taller.estado]}
                </span>
                {taller.direccion && (
                  <span className={estilos.metadato}>{taller.direccion}</span>
                )}
              </div>
              <div className={estilos.acciones}>
                <button
                  type="button"
                  className={estilos.botonChico}
                  onClick={() => abrirFormulario(taller)}
                  disabled={enviando}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className={`${estilos.botonChico} ${estilos.botonPeligro}`}
                  onClick={() => borrar(taller)}
                  disabled={enviando}
                >
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </EstadoDeDatos>
    </section>
  );
}

export default TalleresAdmin;
