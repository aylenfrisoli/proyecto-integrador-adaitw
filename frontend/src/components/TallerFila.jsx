import { armarLinkWhatsapp } from "../config/contacto";
import {
  armarMensajeTaller,
  ETIQUETAS_ESTADO,
  ETIQUETAS_MODALIDAD,
  formatearFecha,
  formatearHora,
} from "../utils/talleres";
import styles from "./TallerFila.module.css";

// textos que reemplazan al boton cuando ya no se puede uno inscribir
const AVISOS = {
  completo: "El cupo está completo por ahora.",
  finalizado: "Este taller ya se realizó.",
};

// fila de un taller: titulo con sus etiquetas, la descripcion y la ficha con fecha, hora, lugar y boton de inscripcion
function TallerFila({ taller }) {
  const abierto = taller.estado === "abierto";

  return (
    // un taller finalizado se ve apagado, igual que un producto agotado
    <li className={`${styles.fila} ${taller.estado === "finalizado" ? styles.finalizado : ""}`}>
      <div>
        <h3 className={styles.titulo}>{taller.titulo}</h3>
        <div className={styles.etiquetas}>
          <span className={styles.etiqueta}>{ETIQUETAS_MODALIDAD[taller.modalidad]}</span>
          <span className={`${styles.etiqueta} ${styles.etiquetaEstado}`}>{ETIQUETAS_ESTADO[taller.estado]}</span>
        </div>
      </div>

      <p className={styles.descripcion}>{taller.descripcion}</p>

      <div className={styles.ficha}>
        {/* lista de definiciones: cada dato lleva su nombre (Fecha, Hora, Lugar) y su valor */}
        <dl className={styles.datos}>
          <dt>Fecha</dt>
          <dd>{formatearFecha(taller.fecha)}</dd>
          <dt>Hora</dt>
          <dd>{formatearHora(taller.fecha)} hs</dd>
          {/* la direccion solo existe en los talleres presenciales */}
          {taller.direccion && (
            <>
              <dt>Lugar</dt>
              <dd>{taller.direccion}</dd>
            </>
          )}
        </dl>

        {abierto ? (
          // se abre en otra pestaña; noopener evita que la pagina nueva pueda controlar esta
          <a
            href={armarLinkWhatsapp(armarMensajeTaller(taller))}
            className={styles.boton}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Inscribirme al taller ${taller.titulo} por WhatsApp`}
          >
            Inscribirme por WhatsApp
            <span className={styles.flecha} aria-hidden="true">
              →
            </span>
          </a>
        ) : (
          <p className={styles.aviso}>{AVISOS[taller.estado]}</p>
        )}
      </div>
    </li>
  );
}

export default TallerFila;
