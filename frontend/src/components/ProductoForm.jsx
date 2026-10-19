import { useState } from "react";
import estilos from "../styles/admin.module.css";
import { ETIQUETAS_DISPONIBILIDAD } from "../utils/productos";
import CampoImagen from "./CampoImagen";
import SelectCategoria from "./SelectCategoria";

// formulario de producto: sirve para crear (producto = null) y para editar (producto con datos)
function ProductoForm({ producto, categorias, enviando, onGuardar, onCancelar }) {
  const [titulo, setTitulo] = useState(producto?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "");
  const [imagen, setImagen] = useState(producto?.imagen ?? "");
  const [categoria, setCategoria] = useState(producto?.categoria._id ?? "");
  // el precio se guarda como texto en el input; si el producto no tiene precio la api no manda el campo, por eso el ""
  const [precio, setPrecio] = useState(producto?.precio?.toString() ?? "");
  const [disponibilidad, setDisponibilidad] = useState(producto?.disponibilidad ?? "disponible");

  function manejarEnvio(evento) {
    evento.preventDefault();
    onGuardar({
      titulo,
      descripcion,
      imagen,
      categoria,
      // precio vacio se manda como null: al editar es la forma de sacarle el precio, y la landing muestra "Consultar precio"
      precio: precio === "" ? null : Number(precio),
      disponibilidad,
    });
  }

  return (
    <form onSubmit={manejarEnvio} className={estilos.tarjetaForm}>
      <h3 className={estilos.tituloForm}>
        {producto ? "Editar producto" : "Nuevo producto"}
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

        <SelectCategoria
          valor={categoria}
          onChange={setCategoria}
          categorias={categorias}
        />

        <label className={estilos.campo}>
          Precio en pesos (opcional)
          <input
            type="number"
            min="0"
            step="1"
            value={precio}
            onChange={(evento) => setPrecio(evento.target.value)}
            placeholder="Ej: 18500"
          />
          <span className={estilos.pista}>
            Si lo dejás vacío, en el sitio se muestra "Consultar precio".
          </span>
        </label>

        <label className={estilos.campo}>
          Disponibilidad
          <select
            value={disponibilidad}
            onChange={(evento) => setDisponibilidad(evento.target.value)}
          >
            {/* las opciones salen del mismo diccionario que usa la landing, asi los textos siempre coinciden */}
            {Object.entries(ETIQUETAS_DISPONIBILIDAD).map(([valor, etiqueta]) => (
              <option key={valor} value={valor}>
                {etiqueta}
              </option>
            ))}
          </select>
        </label>

        <CampoImagen valor={imagen} onChange={setImagen} cuadrada />
      </div>

      <div className={`${estilos.acciones} ${estilos.accionesForm}`}>
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {producto ? "Guardar cambios" : "Crear producto"}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default ProductoForm;
