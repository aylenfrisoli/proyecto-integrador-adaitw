import { Link } from "react-router-dom";
import styles from "./AdminTabs.module.css";

// pestañas del panel: cada una es un link a /admin/:seccion y la activa se marca segun la url
function AdminTabs({ paneles, activo }) {
  return (
    <nav className={styles.tabs} aria-label="Secciones del panel">
      {paneles.map((panel) => (
        <Link
          key={panel.id}
          to={`/admin/${panel.id}`}
          className={`${styles.tab} ${panel.id === activo ? styles.activa : ""}`}
          aria-current={panel.id === activo ? "page" : undefined}
        >
          {panel.nombre}
        </Link>
      ))}
    </nav>
  );
}

export default AdminTabs;
