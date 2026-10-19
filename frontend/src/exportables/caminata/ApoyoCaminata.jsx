import Forma from "../../components/Forma";
import { INSTAGRAM_CAMINATA } from "../../config/contacto";
import styles from "./ApoyoCaminata.module.css";

// invitacion a apoyar el proyecto siguiendo la cuenta de instagram de la caminata
// no depende de los datos de la api: asi se ve siempre, tambien mientras las ediciones cargan o si fallan
function ApoyoCaminata() {
  const { usuario, url } = INSTAGRAM_CAMINATA;

  return (
    <aside className={styles.apoyo} aria-labelledby="titulo-apoyo-caminata">
      {/* formas de adorno en las esquinas, detras del texto */}
      <Forma tipo="blob" colores={["rose-soft"]} className={styles.mancha} />
      <Forma tipo="mariposa" colores={["rose-soft", "yellow"]} duracion={0.8} vuela className={styles.mariposa} />

      <div className={styles.texto}>
        <h3 id="titulo-apoyo-caminata" className={styles.titulo}>
          Apoyá este proyecto <span className={styles.acento}>en redes</span>
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
        className={styles.boton}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Seguir en Instagram: @${usuario} (se abre en una pestaña nueva)`}
      >
        Seguir en Instagram
        <span className={styles.flecha} aria-hidden="true">
          →
        </span>
      </a>
    </aside>
  );
}

export default ApoyoCaminata;
