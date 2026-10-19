import styles from "./EncabezadoSeccion.module.css";

// una linea del titular: sirve para poner una forma animada al lado del texto
export function Linea({ children }) {
  return <span className={styles.linea}>{children}</span>;
}

// ultima linea del titular: letra manuscrita y con el color de acento de la seccion (ver --color-acento en el css de cada una)
export function Acento({ children }) {
  return <span className={styles.acento}>{children}</span>;
}

// cabecera que repiten las secciones de la landing: el titular grande arriba y debajo, a la izquierda, la bajada
// children es lo que va debajo de la bajada, por ejemplo los botones de filtro
// titulo recibe jsx (varias <Linea>) porque cada titular combina texto y formas distintas
function EncabezadoSeccion({ titulo, descripcion, children }) {
  return (
    <header className={styles.encabezado}>
      <h2 className={styles.titulo}>{titulo}</h2>
      <div className={styles.lateral}>
        <p className={styles.descripcion}>{descripcion}</p>
        {children}
      </div>
    </header>
  );
}

export default EncabezadoSeccion;
