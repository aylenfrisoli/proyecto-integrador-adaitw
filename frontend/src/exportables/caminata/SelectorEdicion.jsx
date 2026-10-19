// se reusan los estilos del filtro de categorias para que los botones se vean exactamente igual
import estilos from "../../components/CategoriaFilter.module.css";

// un boton por edicion de la caminata; a diferencia de las categorias no hay opcion "Todas", siempre se ve una edicion
function SelectorEdicion({ ediciones, elegidaId, onElegir }) {
  return (
    <div className={estilos.filtro} role="group" aria-label="Elegir edición">
      {ediciones.map((edicion) => (
        <button
          key={edicion._id}
          type="button"
          className={`${estilos.boton} ${elegidaId === edicion._id ? estilos.activo : ""}`}
          aria-pressed={elegidaId === edicion._id}
          onClick={() => onElegir(edicion._id)}
        >
          {edicion.nombre}
        </button>
      ))}
    </div>
  );
}

export default SelectorEdicion;
