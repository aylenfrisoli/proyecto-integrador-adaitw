import styles from "./ObraCard.module.css";

// colores de los circulos con el numero, se reparten uno por uno y volviendo a empezar
const COLORES_NUMERO = ["yellow", "white", "rose-soft", "sky-soft"];

// tarjeta de una obra: la imagen lleva la categoria y un numero encima, y debajo van el titulo y la descripcion sobre el fondo de la seccion
function ObraCard({ obra, numero }) {
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
        <span
          className={styles.numero}
          style={{ "--fondo-numero": `var(--color-${COLORES_NUMERO[(numero - 1) % COLORES_NUMERO.length]})` }}
        >
          {String(numero).padStart(2, "0")}
        </span>
      </div>

      <div>
        <h3 className={styles.titulo}>{obra.titulo}</h3>
        <p className={styles.descripcion}>{obra.descripcion}</p>
      </div>
    </article>
  );
}

export default ObraCard;
