import { useState } from "react";
import { Link } from "react-router-dom";
import useAccion from "../hooks/useAccion";
import useApi from "../hooks/useApi";
import useFetch from "../hooks/useFetch";
import estilos from "../styles/admin.module.css";
import EstadoDeDatos from "./EstadoDeDatos";
import MensajeAdmin from "./MensajeAdmin";
import ObraForm from "./ObraForm";

// panel de obras: lista con miniatura y un formulario que se abre para crear o editar
function ObrasAdmin() {
  const { data: obras, loading, error, recargar } = useFetch("/obras");
  const { data: categorias, loading: cargandoCategorias } = useFetch("/categorias");
  const { pedir } = useApi();
  const { ejecutar, enviando, mensaje, limpiarMensaje } = useAccion(recargar);

  // null = formulario cerrado; { obra: null } = obra nueva; { obra } = editando esa obra
  const [formulario, setFormulario] = useState(null);

  // mientras no llegan los datos son null, por eso se usan arrays vacios para no romper el map
  const lista = obras ?? [];
  const listaCategorias = categorias ?? [];
  // sin categorias no se puede crear una obra, porque cada obra necesita una
  const sinCategorias = !cargandoCategorias && listaCategorias.length === 0;

  function abrirFormulario(obra) {
    limpiarMensaje();
    setFormulario({ obra });
  }

  // crea o edita segun el formulario tenga una obra o no; si sale bien lo cierra
  async function guardar(datos) {
    const editando = formulario.obra;
    const ok = await ejecutar(
      () =>
        editando
          ? pedir(`/obras/${editando._id}`, { metodo: "PUT", cuerpo: datos })
          : pedir("/obras", { metodo: "POST", cuerpo: datos }),
      editando ? "Obra actualizada." : "Obra creada.",
    );
    if (ok) setFormulario(null);
  }

  async function borrar(obra) {
    // confirm frena la accion hasta que la usuaria responda, para no borrar por un clic de mas
    if (!window.confirm(`¿Querés borrar la obra "${obra.titulo}"?`)) {
      return;
    }
    await ejecutar(
      () => pedir(`/obras/${obra._id}`, { metodo: "DELETE" }),
      "Obra borrada.",
    );
  }

  return (
    <section className={`container ${estilos.seccion}`}>
      <h2 className={`display-title ${estilos.titulo}`}>Obras</h2>
      <p className={estilos.descripcion}>
        Las pinturas, collages y bordados que se muestran en la galería del
        sitio. Cada obra necesita una categoría y el link de su imagen.
      </p>

      <div className={estilos.barraLista}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => abrirFormulario(null)}
          disabled={sinCategorias || formulario !== null}
        >
          Nueva obra
        </button>
        {sinCategorias && (
          <p className={estilos.pista}>
            Primero tenés que <Link to="/admin/categorias">crear una categoría</Link>.
          </p>
        )}
      </div>

      <MensajeAdmin mensaje={mensaje} />

      {/* la key hace que el formulario se reinicie al pasar de editar una obra a otra */}
      {formulario && (
        <ObraForm
          key={formulario.obra?._id ?? "nueva"}
          obra={formulario.obra}
          categorias={listaCategorias}
          enviando={enviando}
          onGuardar={guardar}
          onCancelar={() => setFormulario(null)}
        />
      )}

      <EstadoDeDatos
        loading={loading}
        error={error}
        vacio={lista.length === 0}
        textoVacio="Todavía no cargaste ninguna obra."
      >
        <ul className={estilos.lista}>
          {lista.map((obra) => (
            <li key={obra._id} className={estilos.fila}>
              <div className={estilos.filaContenido}>
                {/* alt vacio porque la imagen es decorativa: el titulo ya esta escrito al lado */}
                <img src={obra.imagen} alt="" className={estilos.miniatura} loading="lazy" />
                <div>
                  <span className={estilos.nombre}>{obra.titulo}</span>
                  <span className={estilos.metadato}>{obra.categoria.nombre}</span>
                </div>
              </div>
              <div className={estilos.acciones}>
                <button
                  type="button"
                  className={estilos.botonChico}
                  onClick={() => abrirFormulario(obra)}
                  disabled={enviando}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className={`${estilos.botonChico} ${estilos.botonPeligro}`}
                  onClick={() => borrar(obra)}
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

export default ObrasAdmin;
