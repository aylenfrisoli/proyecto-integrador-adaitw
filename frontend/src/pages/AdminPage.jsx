import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./AdminPage.module.css";

// panel de administracion: por ahora solo confirma la sesion y permite salir; el crud se suma en el proximo paso
function AdminPage() {
  const { logout } = useAuth();

  return (
    <main className={`container ${styles.pagina}`}>
      <p className={styles.etiqueta}>Panel de administración</p>
      <h1 className={`display-title ${styles.titulo}`}>Hola, Sara</h1>
      <p className={styles.bajada}>
        Iniciaste sesión correctamente. Muy pronto vas a poder gestionar tus
        obras, productos y talleres desde acá.
      </p>

      <div className={styles.acciones}>
        <Link to="/" className="btn btn-outline">
          Ver el sitio
        </Link>
        <button type="button" className="btn btn-primary" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}

export default AdminPage;
