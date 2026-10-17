import { Link, useParams } from "react-router-dom";
import AdminTabs from "../components/AdminTabs";
import CategoriasAdmin from "../components/CategoriasAdmin";
import ObrasAdmin from "../components/ObrasAdmin";
import ProductosAdmin from "../components/ProductosAdmin";
import TalleresAdmin from "../components/TalleresAdmin";
import { useAuth } from "../context/AuthContext";
import NotFoundPage from "./NotFoundPage";
import styles from "./AdminPage.module.css";

// paneles disponibles: el id es lo que va en la url (/admin/categorias) y componente es lo que se muestra
// para sumar un panel nuevo alcanza con agregar una linea aca
const PANELES = [
  { id: "categorias", nombre: "Categorías", componente: CategoriasAdmin },
  { id: "obras", nombre: "Obras", componente: ObrasAdmin },
  { id: "productos", nombre: "Productos", componente: ProductosAdmin },
  { id: "talleres", nombre: "Talleres", componente: TalleresAdmin },
];

// estructura del panel de administracion: cabecera con acciones, pestañas y el panel de la seccion elegida
function AdminPage() {
  const { logout } = useAuth();
  // la seccion sale de la url: en /admin/categorias vale "categorias"
  const { seccion } = useParams();

  const panel = PANELES.find((p) => p.id === seccion);

  // una seccion que no existe (ej: /admin/cosas) se trata como cualquier otra ruta inexistente
  if (!panel) {
    return <NotFoundPage />;
  }

  // con mayuscula inicial para que react lo use como componente y no como una etiqueta html
  const Panel = panel.componente;

  return (
    <>
      <header className={styles.cabecera}>
        <div className={`container ${styles.barra}`}>
          <div>
            <p className={styles.etiqueta}>Panel de administración</p>
            <Link to="/admin" className={`brand-logo ${styles.logo}`}>
              SAF Creaciones para Vos
            </Link>
          </div>
          <div className={styles.acciones}>
            <Link to="/" className="btn btn-outline">
              Ver el sitio
            </Link>
            <button type="button" className="btn btn-primary" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        </div>
        <div className="container">
          <AdminTabs paneles={PANELES} activo={panel.id} />
        </div>
      </header>

      <main>
        <Panel />
      </main>
    </>
  );
}

export default AdminPage;
