import styles from "./EstadoDeDatos.module.css";

// decide que mostrar mientras llegan los datos de la api: cargando, error, lista vacia o el contenido (children)
function EstadoDeDatos({ loading, error, vacio, textoVacio, children }) {
  if (loading) {
    // el servidor gratuito de render se duerme, por eso la primera carga puede tardar y conviene avisarlo
    return (
      <p className={styles.mensaje} role="status">
        Cargando… la primera vez puede tardar unos segundos.
      </p>
    );
  }

  if (error) {
    // role alert hace que los lectores de pantalla anuncien el error apenas aparece
    return (
      <p className={`${styles.mensaje} ${styles.error}`} role="alert">
        {error}
      </p>
    );
  }

  if (vacio) {
    return <p className={styles.mensaje}>{textoVacio}</p>;
  }

  return children;
}

export default EstadoDeDatos;
