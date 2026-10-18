import { FaInstagram } from "react-icons/fa";
import { INSTAGRAM_CAMINATA } from "../config/contacto";
import styles from "./ApoyoCaminata.module.css";

// invitacion a apoyar el proyecto siguiendo la cuenta de instagram de la caminata
// no depende de los datos de la api: asi se ve siempre, tambien mientras las ediciones cargan o si fallan
function ApoyoCaminata() {
  const { usuario, url } = INSTAGRAM_CAMINATA;

  return (
    <aside className={styles.apoyo} aria-labelledby="titulo-apoyo-caminata">
      {/* es solo decoracion: el titulo y el boton ya dicen de que se trata */}
      <span className={styles.icono} aria-hidden="true">
        <FaInstagram />
      </span>

      <div className={styles.texto}>
        <h3 id="titulo-apoyo-caminata" className={styles.titulo}>
          Apoyá este proyecto en redes
        </h3>
        <p className={styles.bajada}>
          Seguí a <span className={styles.usuario}>@{usuario}</span> en
          Instagram y compartí la caminata para que llegue a más personas.
        </p>
      </div>

      {/* target _blank abre otra pestaña y noopener noreferrer evita que la pagina de afuera pueda controlar esta */}
      {/* el aria-label empieza con el texto visible y suma que se abre en una pestaña nueva */}
      <a
        href={url}
        className={`btn btn-primary ${styles.boton}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Seguir en Instagram: @${usuario} (se abre en una pestaña nueva)`}
      >
        Seguir en Instagram
      </a>
    </aside>
  );
}

export default ApoyoCaminata;
