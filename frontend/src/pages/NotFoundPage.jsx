import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

// pagina 404: se muestra para cualquier ruta que no exista
function NotFoundPage() {
  return (
    <main className={styles.pagina}>
      <p className={styles.codigo}>404</p>
      <h1 className={`display-title ${styles.titulo}`}>Esta página no existe</h1>
      <p className={styles.bajada}>
        Puede que el link esté mal escrito o que la página ya no esté.
      </p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </main>
  );
}

export default NotFoundPage;
