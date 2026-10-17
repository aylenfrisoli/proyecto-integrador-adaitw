import { useState } from "react";
import { Link } from "react-router-dom";
import useAccion from "../hooks/useAccion";
import useApi from "../hooks/useApi";
import useFetch from "../hooks/useFetch";
import estilos from "../styles/admin.module.css";
import { ETIQUETAS_DISPONIBILIDAD, formatearPrecio } from "../utils/productos";
import EstadoDeDatos from "./EstadoDeDatos";
import MensajeAdmin from "./MensajeAdmin";
import ProductoForm from "./ProductoForm";

// panel de productos: igual que el de obras, con una lista con miniatura y un formulario que se abre para crear o editar
function ProductosAdmin() {
  const { data: productos, loading, error, recargar } = useFetch("/productos");
  const { data: categorias, loading: cargandoCategorias } = useFetch("/categorias");
  const { pedir } = useApi();
  const { ejecutar, enviando, mensaje, limpiarMensaje } = useAccion(recargar);

  // null = formulario cerrado; { producto: null } = producto nuevo; { producto } = editando ese producto
  const [formulario, setFormulario] = useState(null);

  // mientras no llegan los datos son null, por eso se usan arrays vacios para no romper el map
  const lista = productos ?? [];
  const listaCategorias = categorias ?? [];
  // sin categorias no se puede crear un producto, porque cada uno necesita una
  const sinCategorias = !cargandoCategorias && listaCategorias.length === 0;

  function abrirFormulario(producto) {
    limpiarMensaje();
    setFormulario({ producto });
  }

  // crea o edita segun el formulario tenga un producto o no; si sale bien lo cierra
  async function guardar(datos) {
    const editando = formulario.producto;
    const ok = await ejecutar(
      () =>
        editando
          ? pedir(`/productos/${editando._id}`, { metodo: "PUT", cuerpo: datos })
          : pedir("/productos", { metodo: "POST", cuerpo: datos }),
      editando ? "Producto actualizado." : "Producto creado.",
    );
    if (ok) setFormulario(null);
  }

  async function borrar(producto) {
    // confirm frena la accion hasta que la usuaria responda, para no borrar por un clic de mas
    if (!window.confirm(`¿Querés borrar el producto "${producto.titulo}"?`)) {
      return;
    }
    await ejecutar(
      () => pedir(`/productos/${producto._id}`, { metodo: "DELETE" }),
      "Producto borrado.",
    );
  }

  return (
    <section className={`container ${estilos.seccion}`}>
      <h2 className={`display-title ${estilos.titulo}`}>Productos</h2>
      <p className={estilos.descripcion}>
        Lo que tenés a la venta: cajas, bordados, bolsos y papelería. El precio
        es opcional y la consulta se hace por WhatsApp.
      </p>

      <div className={estilos.barraLista}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => abrirFormulario(null)}
          disabled={sinCategorias || formulario !== null}
        >
          Nuevo producto
        </button>
        {sinCategorias && (
          <p className={estilos.pista}>
            Primero tenés que <Link to="/admin/categorias">crear una categoría</Link>.
          </p>
        )}
      </div>

      <MensajeAdmin mensaje={mensaje} />

      {/* la key hace que el formulario se reinicie al pasar de editar un producto a otro */}
      {formulario && (
        <ProductoForm
          key={formulario.producto?._id ?? "nuevo"}
          producto={formulario.producto}
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
        textoVacio="Todavía no cargaste ningún producto."
      >
        <ul className={estilos.lista}>
          {lista.map((producto) => (
            <li key={producto._id} className={estilos.fila}>
              <div className={estilos.filaContenido}>
                {/* alt vacio porque la imagen es decorativa: el titulo ya esta escrito al lado */}
                <img
                  src={producto.imagen}
                  alt=""
                  className={`${estilos.miniatura} ${estilos.miniaturaCuadrada}`}
                  loading="lazy"
                />
                <div>
                  <span className={estilos.nombre}>{producto.titulo}</span>
                  <span className={estilos.metadato}>
                    {producto.categoria.nombre} · {formatearPrecio(producto.precio)} ·{" "}
                    {ETIQUETAS_DISPONIBILIDAD[producto.disponibilidad]}
                  </span>
                </div>
              </div>
              <div className={estilos.acciones}>
                <button
                  type="button"
                  className={estilos.botonChico}
                  onClick={() => abrirFormulario(producto)}
                  disabled={enviando}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className={`${estilos.botonChico} ${estilos.botonPeligro}`}
                  onClick={() => borrar(producto)}
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

export default ProductosAdmin;
