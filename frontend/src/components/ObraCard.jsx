import styles from "./ObraCard.module.css";

// tarjeta de una obra: la imagen lleva la categoria encima, y debajo van el titulo y la descripcion sobre el fondo de la seccion
function ObraCard({ obra }) {
  return (
    <article className={styles.tarjeta}>
      <div className={styles.contenedorImagen}>
        {/* lazy hace que el navegador cargue la imagen recien cuando esta cerca de verse */}
        <img
          src={obra.imagen}
          alt={obra.titulo}
          className={styles.imagen}
          loading="lazy"
        />
        <span className={styles.categoria}>{obra.categoria.nombre}</span>
      </div>

      <div>
        <h3 className={styles.titulo}>{obra.titulo}</h3>
        <p className={styles.descripcion}>{obra.descripcion}</p>
      </div>
    </article>
  );
}

export default ObraCard;
