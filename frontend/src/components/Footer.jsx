import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { REDES } from "../config/contacto";
import { SECCIONES } from "../config/secciones";
import styles from "./Footer.module.css";

// icono de cada red, se elige con el id que tiene en config/contacto.js
const ICONOS = {
  instagram: FaInstagram,
  facebook: FaFacebookF,
};

// pie de pagina oscuro con la marca, los links a las secciones, la ubicacion y las redes
function Footer() {
  // el anio se calcula para no tener que actualizar el copyright a mano
  const anio = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <p className={styles.logo}>SAF Creaciones para Vos</p>
          <p className={styles.text}>
            Piezas únicas hechas a mano, con dedicación y calidez, para
            inspirar y conectar a las personas con la alegría de la creatividad.
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
          <h2 className={styles.title}>Ubicación</h2>
          <p className={styles.text}>Costa argentina</p>

          <h2 className={`${styles.title} ${styles.tituloRedes}`}>Seguinos</h2>
          <ul className={styles.redes}>
            {REDES.map((red) => {
              // con mayuscula inicial para que react lo use como componente
              const Icono = ICONOS[red.id];
              return (
                <li key={red.id}>
                  {/* target _blank abre la red en otra pestaña; noopener evita que esa pagina controle esta */}
                  <a
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.red}
                    aria-label={`${red.nombre} de SAF Creaciones para Vos`}
                  >
                    <Icono aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <small>
          © {anio} SAF Creaciones para Vos · Sara Figarra, artista plástica
        </small>
        {/* acceso discreto al panel: no esta en la navbar porque es solo para la administradora */}
        <Link to="/login" className={styles.acceso}>
          Acceso administradora
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
