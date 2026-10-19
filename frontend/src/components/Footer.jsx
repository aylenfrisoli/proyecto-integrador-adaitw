import { Link } from "react-router-dom";
import { REDES } from "../config/contacto";
import { SECCIONES } from "../config/secciones";
import Bandas from "./Bandas";
import Forma from "./Forma";
import styles from "./Footer.module.css";

// pie de pagina azul tinta y compacto: la info de la marca, los links y los datos de contacto, con rayas onduladas arriba y tres formas chicas a la derecha
function Footer() {
  // el anio se calcula para no tener que actualizar el copyright a mano
  const anio = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Bandas color="sky" className={styles.bandas} />
      {/* formas chicas en el costado derecho, al lado de las redes; en pantallas angostas se ocultan */}
      <Forma tipo="flor" colores={["sky", "yellow"]} duracion={30} className={`${styles.deco} ${styles.flor}`} />
      <Forma tipo="pincel" colores={["rose", "rose-soft"]} duracion={4} className={`${styles.deco} ${styles.pincel}`} />
      <Forma tipo="gota" colores={["rose-soft"]} duracion={3.8} className={`${styles.deco} ${styles.gota}`} />

      <div className={`container ${styles.contenido}`}>
        <div className={styles.grid}>
          <div>
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
            <p className={styles.lugar}>Costa argentina</p>

            <h2 className={`${styles.title} ${styles.tituloRedes}`}>Seguinos</h2>
            <ul className={styles.redes}>
              {REDES.map((red) => (
                <li key={red.id}>
                  {/* target _blank abre la red en otra pestaña; noopener evita que esa pagina controle esta */}
                  <a
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.red}
                    aria-label={`${red.nombre} de SAF Creaciones para Vos`}
                  >
                    {red.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <small className={styles.copyright}>
            © {anio} SAF Creaciones para Vos · Sara Figarra
          </small>
          <div className={styles.enlaces}>
            {/* acceso discreto al panel: no esta en la navbar porque es solo para la administradora */}
            <Link to="/login" className={styles.acceso}>
              Acceso administradora
            </Link>
            <a href="#inicio" className={styles.acceso}>
              Volver arriba ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
