import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { REDES } from "../config/contacto";
import { SECCIONES } from "../config/secciones";
import styles from "./Footer.module.css";
import Silueta from "./Silueta";

// icono de cada red, se elige con el id que tiene en config/contacto.js
const ICONOS = {
  instagram: FaInstagram,
  facebook: FaFacebookF,
};

// pie de pagina como un prado: lomas arriba, la info sobre fondo salvia suave, siluetas paradas en el pasto y una franja de musgo con el copyright
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

      {/* las siluetas paradas en el pasto: de la cuarta en adelante se ocultan en el celular para que no se amontonen */}
      <div className={`container ${styles.suelo}`}>
        <Silueta tipo="helecho" color="musgo" tamano="7rem" giro={-4} />
        <Silueta tipo="flor" color="ladrillo" tamano="3.5rem" giro={6} />
        <Silueta tipo="hongo" color="tierra" tamano="3.5rem" />
        <Silueta tipo="margarita" color="ocre" tamano="4.5rem" giro={-8} />
        <Silueta tipo="piedras" color="tierra" tamano="3rem" />
        <Silueta tipo="pajaro" color="musgo" tamano="4rem" giro={-4} />
        <Silueta tipo="rama" color="salvia" tamano="8rem" giro={6} />
      </div>

      <div className={styles.base}>
        <div className={`container ${styles.bottom}`}>
          <small>
            © {anio} SAF Creaciones para Vos · Sara Figarra, artista plástica
          </small>
          {/* acceso discreto al panel: no esta en la navbar porque es solo para la administradora */}
          <Link to="/login" className={styles.acceso}>
            Acceso administradora
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
