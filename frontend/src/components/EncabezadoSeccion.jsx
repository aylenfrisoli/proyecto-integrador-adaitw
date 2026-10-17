import styles from "./EncabezadoSeccion.module.css";

// cabecera que repiten las secciones de la landing: ficha chica, titular y una bajada opcional
function EncabezadoSeccion({ etiqueta, titulo, descripcion }) {
  return (
    <header className={styles.encabezado}>
      <p className={styles.etiqueta}>{etiqueta}</p>
      <h2 className={`display-title ${styles.titulo}`}>{titulo}</h2>
      {descripcion && <p className={styles.descripcion}>{descripcion}</p>}
    </header>
  );
}

export default EncabezadoSeccion;
