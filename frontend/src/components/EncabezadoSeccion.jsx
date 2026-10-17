import FormaDecorativa from "./FormaDecorativa";
import styles from "./EncabezadoSeccion.module.css";

// cabecera que repiten las secciones de la landing: ficha chica con una forma decorativa opcional, titular y una bajada opcional
// forma es un objeto { tipo, color } con lo que recibe FormaDecorativa
function EncabezadoSeccion({ etiqueta, titulo, descripcion, forma }) {
  return (
    <header className={styles.encabezado}>
      {/* la forma va en la misma fila que la etiqueta y no encima del titulo, asi nunca tapa el texto */}
      <div className={styles.fila}>
        <p className={styles.etiqueta}>{etiqueta}</p>
        {forma && <FormaDecorativa tipo={forma.tipo} color={forma.color} />}
      </div>
      <h2 className={`display-title ${styles.titulo}`}>{titulo}</h2>
      {descripcion && <p className={styles.descripcion}>{descripcion}</p>}
    </header>
  );
}

export default EncabezadoSeccion;
