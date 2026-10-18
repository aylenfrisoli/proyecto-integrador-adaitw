import styles from "./ObraCard.module.css";

// tarjeta de una obra: imagen en proporcion 4/5 con zoom al pasar el mouse, categoria, titulo y descripcion
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
      </div>
      <div className={styles.info}>
        <p className={styles.categoria}>{obra.categoria.nombre}</p>
        <h3 className={styles.titulo}>{obra.titulo}</h3>
        <p className={styles.descripcion}>{obra.descripcion}</p>
      </div>
    </article>
  );
}

export default ObraCard;
