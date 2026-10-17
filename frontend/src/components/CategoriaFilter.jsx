import styles from "./CategoriaFilter.module.css";

// botones para filtrar por categoria; sirve para obras y productos porque solo recibe la lista y avisa cual se eligio
function CategoriaFilter({ categorias, seleccionada, onSeleccionar }) {
  return (
    <div className={styles.filtro} role="group" aria-label="Filtrar por categoría">
      {/* "Todas" manda un id vacio, que filtrarPorCategoria interpreta como sin filtro */}
      <button
        type="button"
        className={`${styles.boton} ${seleccionada === "" ? styles.activo : ""}`}
        aria-pressed={seleccionada === ""}
        onClick={() => onSeleccionar("")}
      >
        Todas
      </button>

      {categorias.map((categoria) => (
        <button
          key={categoria._id}
          type="button"
          className={`${styles.boton} ${seleccionada === categoria._id ? styles.activo : ""}`}
          aria-pressed={seleccionada === categoria._id}
          onClick={() => onSeleccionar(categoria._id)}
        >
          {categoria.nombre}
        </button>
      ))}
    </div>
  );
}

export default CategoriaFilter;
