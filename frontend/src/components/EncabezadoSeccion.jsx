import Silueta from "./Silueta";
import styles from "./EncabezadoSeccion.module.css";

// cabecera que repiten las secciones de la landing: ficha chica con una silueta natural opcional, titular y una bajada opcional
// silueta es un objeto { tipo, color } con lo que recibe Silueta
function EncabezadoSeccion({ etiqueta, titulo, descripcion, silueta }) {
  return (
    <header className={styles.encabezado}>
      {/* la silueta va en la misma fila que la etiqueta y no encima del titulo, asi nunca tapa el texto */}
      <div className={styles.fila}>
        <p className={styles.etiqueta}>{etiqueta}</p>
        {silueta && <Silueta tipo={silueta.tipo} color={silueta.color} tamano="2.5rem" />}
      </div>
      <h2 className={`display-title ${styles.titulo}`}>{titulo}</h2>
      {descripcion && <p className={styles.descripcion}>{descripcion}</p>}
    </header>
  );
}

export default EncabezadoSeccion;
