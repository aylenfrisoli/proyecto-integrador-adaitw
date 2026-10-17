import { SECCIONES } from "../config/secciones";
import styles from "./Footer.module.css";

// pie de pagina oscuro con la marca, los links a las secciones y la ubicacion
function Footer() {
  // el anio se calcula para no tener que actualizar el copyright a mano
  const anio = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <p className={styles.logo}>SAF Creaciones para Vos</p>
          <p className={styles.text}>
            Piezas unicas hechas a mano, con dedicacion y calidez, para
            inspirar y conectar a las personas con la alegria de la creatividad.
          </p>
        </div>

        <nav aria-label="Secciones">
          <h2 className={styles.title}>Secciones</h2>
          <ul className={styles.list}>
            {SECCIONES.map((seccion) => (
              <li key={seccion.id}>
                <a href={`#${seccion.id}`} className={styles.link}>
                  {seccion.nombre}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={styles.title}>Ubicacion</h2>
          <p className={styles.text}>Costa argentina</p>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <small>
          © {anio} SAF Creaciones para Vos · Sara Figarra, artista plastica
        </small>
      </div>
    </footer>
  );
}

export default Footer;
