import { FiCalendar, FiMapPin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { armarLinkWhatsapp } from "../config/contacto";
import {
  armarMensajeTaller,
  ETIQUETAS_ESTADO,
  ETIQUETAS_MODALIDAD,
  formatearFecha,
  formatearHora,
} from "../utils/talleres";
import styles from "./TallerCard.module.css";

// textos que reemplazan al boton cuando ya no se puede uno inscribir
const AVISOS = {
  completo: "El cupo está completo por ahora.",
  finalizado: "Este taller ya se realizó.",
};

// tarjeta de un taller: fecha, modalidad, estado, direccion (solo si es presencial) y boton de inscripcion
function TallerCard({ taller }) {
  const abierto = taller.estado === "abierto";

  return (
    // la clase de modalidad pinta la tarjeta (presencial lila, virtual azul) y la de estado apaga los finalizados
    <article
      className={`${styles.tarjeta} ${styles[taller.modalidad]} ${styles[taller.estado]}`}
    >
      <div className={styles.etiquetas}>
        <span className={styles.etiqueta}>
          {ETIQUETAS_MODALIDAD[taller.modalidad]}
        </span>
        {/* el estado "abierto" se destaca con el color de marca; los otros quedan neutros */}
        <span
          className={`${styles.etiqueta} ${abierto ? styles.etiquetaAbierto : ""}`}
        >
          {ETIQUETAS_ESTADO[taller.estado]}
        </span>
      </div>

      <h3 className={styles.titulo}>{taller.titulo}</h3>
      <p className={styles.descripcion}>{taller.descripcion}</p>

      <ul className={styles.datos}>
        <li>
          <FiCalendar aria-hidden="true" />
          {formatearFecha(taller.fecha)} · {formatearHora(taller.fecha)} hs
        </li>
        {/* la direccion solo existe en los talleres presenciales, por eso se pregunta antes de mostrarla */}
        {taller.direccion && (
          <li>
            <FiMapPin aria-hidden="true" />
            {taller.direccion}
          </li>
        )}
      </ul>

      {abierto ? (
        <a
          href={armarLinkWhatsapp(armarMensajeTaller(taller))}
          className={`btn btn-primary ${styles.boton}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Inscribirme al taller ${taller.titulo} por WhatsApp`}
        >
          <FaWhatsapp aria-hidden="true" />
          Inscribirme por WhatsApp
        </a>
      ) : (
        <p className={styles.aviso}>{AVISOS[taller.estado]}</p>
      )}
    </article>
  );
}

export default TallerCard;
