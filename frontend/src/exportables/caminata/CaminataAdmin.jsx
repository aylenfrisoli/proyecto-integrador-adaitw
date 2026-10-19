import { useState } from "react";
import EstadoDeDatos from "../../components/EstadoDeDatos";
import MensajeAdmin from "../../components/MensajeAdmin";
import useAccion from "../../hooks/useAccion";
import useApi from "../../hooks/useApi";
import useFetch from "../../hooks/useFetch";
import estilos from "../../styles/admin.module.css";
import { contarFotos, formatearDia } from "../../utils/caminata";
import CaminataForm from "./CaminataForm";

// panel de la caminata: las ediciones con sus fotos, mismo patron que el de talleres
function CaminataAdmin() {
  const { data: caminatas, loading, error, recargar } = useFetch("/caminatas");
  const { pedir } = useApi();
  const { ejecutar, enviando, mensaje, limpiarMensaje } = useAccion(recargar);

  // null = formulario cerrado; { caminata: null } = edicion nueva; { caminata } = editando esa edicion
  const [formulario, setFormulario] = useState(null);

  // mientras no llegan los datos es null, por eso un array vacio para no romper el map
  const lista = caminatas ?? [];

  function abrirFormulario(caminata) {
    limpiarMensaje();
    setFormulario({ caminata });
  }

  // crea o edita segun el formulario tenga una edicion o no; si sale bien lo cierra
  async function guardar(datos) {
    const editando = formulario.caminata;
    const ok = await ejecutar(
      () =>
        editando
          ? pedir(`/caminatas/${editando._id}`, { metodo: "PUT", cuerpo: datos })
          : pedir("/caminatas", { metodo: "POST", cuerpo: datos }),
      editando ? "Edición actualizada." : "Edición creada.",
    );
    if (ok) setFormulario(null);
  }

  async function borrar(caminata) {
    // las fotos viven dentro de la edicion, asi que se avisa que tambien se pierden
    // el aviso cambia segun la cantidad para que lea bien en singular y en plural
    const cantidad = caminata.fotos.length;
    let aviso = "";
    if (cantidad === 1) {
      aviso = " Se borra también su foto.";
    } else if (cantidad > 1) {
      aviso = ` Se borran también sus ${cantidad} fotos.`;
    }
    // confirm frena la accion hasta que la usuaria responda, para no borrar por un clic de mas
    if (!window.confirm(`¿Querés borrar la edición "${caminata.nombre}"?${aviso}`)) {
      return;
    }
    await ejecutar(
      () => pedir(`/caminatas/${caminata._id}`, { metodo: "DELETE" }),
      "Edición borrada.",
    );
  }

  return (
    <section className={`container ${estilos.seccion}`}>
      <h2 className={`display-title ${estilos.titulo}`}>Caminata</h2>
      <p className={estilos.descripcion}>
        Las ediciones de la Caminata de Concientización sobre el Cáncer de Mama
        que organizás. Cada edición lleva sus fotos, que se muestran como
        polaroids en el sitio.
      </p>

      <div className={estilos.barraLista}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => abrirFormulario(null)}
          disabled={formulario !== null}
        >
          Nueva edición
        </button>
      </div>

      <MensajeAdmin mensaje={mensaje} />

      {/* la key hace que el formulario se reinicie al pasar de editar una edicion a otra */}
      {formulario && (
        <CaminataForm
          key={formulario.caminata?._id ?? "nueva"}
          caminata={formulario.caminata}
          enviando={enviando}
          onGuardar={guardar}
          onCancelar={() => setFormulario(null)}
        />
      )}

      <EstadoDeDatos
        loading={loading}
        error={error}
        vacio={lista.length === 0}
        textoVacio="Todavía no cargaste ninguna edición."
      >
        <ul className={estilos.lista}>
          {lista.map((caminata) => (
            <li key={caminata._id} className={estilos.fila}>
              <div className={estilos.filaContenido}>
                {/* la miniatura es la primera foto; alt vacio porque es decorativa y el nombre ya esta escrito al lado */}
                {caminata.fotos.length > 0 ? (
                  <img
                    src={caminata.fotos[0].url}
                    alt=""
                    className={`${estilos.miniatura} ${estilos.miniaturaCuadrada}`}
                    loading="lazy"
                  />
                ) : (
                  <div
                    className={`${estilos.miniatura} ${estilos.miniaturaCuadrada} ${estilos.miniaturaVacia}`}
                    aria-hidden="true"
                  />
                )}
                <div>
                  <span className={estilos.nombre}>{caminata.nombre}</span>
                  <span className={estilos.metadato}>
                    {formatearDia(caminata.fecha)} · {caminata.lugar}
                  </span>
                  <span className={estilos.metadato}>
                    {contarFotos(caminata.fotos.length)}
                  </span>
                </div>
              </div>
              <div className={estilos.acciones}>
                <button
                  type="button"
                  className={estilos.botonChico}
                  onClick={() => abrirFormulario(caminata)}
                  disabled={enviando}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className={`${estilos.botonChico} ${estilos.botonPeligro}`}
                  onClick={() => borrar(caminata)}
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

export default CaminataAdmin;
