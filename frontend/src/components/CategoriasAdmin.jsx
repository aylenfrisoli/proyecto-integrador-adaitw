import { useState } from "react";
import useApi from "../hooks/useApi";
import useFetch from "../hooks/useFetch";
import estilos from "../styles/admin.module.css";
import EstadoDeDatos from "./EstadoDeDatos";

// panel de categorias: crear, renombrar y borrar; la lista se vuelve a pedir a la api despues de cada cambio
function CategoriasAdmin() {
  const { data: categorias, loading, error, recargar } = useFetch("/categorias");
  const { pedir } = useApi();

  const [nombreNuevo, setNombreNuevo] = useState("");
  // id de la categoria que se esta editando; null = ninguna
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");
  // { tipo: "exito" | "error", texto } o null
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // mientras no llegan los datos categorias es null, por eso se usa un array vacio para no romper el map
  const lista = categorias ?? [];

  // corre una accion contra la api, muestra el resultado y recarga la lista
  // devuelve true si salio bien, asi crear, editar y borrar no repiten el try/catch
  async function ejecutar(accion, textoExito) {
    setEnviando(true);
    setMensaje(null);
    try {
      await accion();
      setMensaje({ tipo: "exito", texto: textoExito });
      recargar();
      return true;
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
      return false;
    } finally {
      setEnviando(false);
    }
  }

  async function crear(evento) {
    evento.preventDefault();
    const ok = await ejecutar(
      () => pedir("/categorias", { metodo: "POST", cuerpo: { nombre: nombreNuevo } }),
      "Categoría creada.",
    );
    // el campo solo se vacia si salio bien, para no perder lo escrito cuando hay un error
    if (ok) setNombreNuevo("");
  }

  function empezarEdicion(categoria) {
    setEditandoId(categoria._id);
    setNombreEditado(categoria.nombre);
    setMensaje(null);
  }

  async function guardar(evento, id) {
    evento.preventDefault();
    const ok = await ejecutar(
      () => pedir(`/categorias/${id}`, { metodo: "PUT", cuerpo: { nombre: nombreEditado } }),
      "Categoría actualizada.",
    );
    if (ok) setEditandoId(null);
  }

  async function borrar(categoria) {
    // confirm frena la accion hasta que la usuaria responda, para no borrar por un clic de mas
    if (!window.confirm(`¿Querés borrar la categoría "${categoria.nombre}"?`)) {
      return;
    }
    await ejecutar(
      () => pedir(`/categorias/${categoria._id}`, { metodo: "DELETE" }),
      "Categoría borrada.",
    );
  }

  return (
    <section className={`container ${estilos.seccion}`}>
      <h2 className={`display-title ${estilos.titulo}`}>Categorías</h2>
      <p className={estilos.descripcion}>
        Agrupan tus obras y productos. No se puede borrar una categoría que
        todavía tenga obras o productos.
      </p>

      <form onSubmit={crear} className={estilos.formulario}>
        <label className={estilos.campo}>
          Nueva categoría
          <input
            type="text"
            value={nombreNuevo}
            onChange={(evento) => setNombreNuevo(evento.target.value)}
            maxLength={50}
            required
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          Agregar
        </button>
      </form>

      {/* role alert para los errores y status para los avisos: los lectores de pantalla los anuncian solos */}
      {mensaje && (
        <p
          className={`${estilos.mensaje} ${mensaje.tipo === "error" ? estilos.error : estilos.exito}`}
          role={mensaje.tipo === "error" ? "alert" : "status"}
        >
          {mensaje.texto}
        </p>
      )}

      <EstadoDeDatos
        loading={loading}
        error={error}
        vacio={lista.length === 0}
        textoVacio="Todavía no creaste ninguna categoría."
      >
        <ul className={estilos.lista}>
          {lista.map((categoria) => (
            <li key={categoria._id} className={estilos.fila}>
              {editandoId === categoria._id ? (
                <form
                  onSubmit={(evento) => guardar(evento, categoria._id)}
                  className={estilos.formularioEdicion}
                >
                  <input
                    type="text"
                    className={estilos.input}
                    value={nombreEditado}
                    onChange={(evento) => setNombreEditado(evento.target.value)}
                    aria-label={`Nuevo nombre para ${categoria.nombre}`}
                    maxLength={50}
                    required
                  />
                  <div className={estilos.acciones}>
                    <button type="submit" className={estilos.botonChico} disabled={enviando}>
                      Guardar
                    </button>
                    <button
                      type="button"
                      className={estilos.botonChico}
                      onClick={() => setEditandoId(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <span className={estilos.nombre}>{categoria.nombre}</span>
                  <div className={estilos.acciones}>
                    <button
                      type="button"
                      className={estilos.botonChico}
                      onClick={() => empezarEdicion(categoria)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={`${estilos.botonChico} ${estilos.botonPeligro}`}
                      onClick={() => borrar(categoria)}
                      disabled={enviando}
                    >
                      Borrar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </EstadoDeDatos>
    </section>
  );
}

export default CategoriasAdmin;
