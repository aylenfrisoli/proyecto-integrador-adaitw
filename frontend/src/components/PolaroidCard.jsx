import { rotacionPolaroid } from "../utils/caminata";
import styles from "./PolaroidCard.module.css";

// clases de cada cinta, se reparten una por una y volviendo a empezar
const CINTAS = [
  styles.cintaRosa,
  styles.cintaLila,
  styles.cintaAzul,
  styles.cintaMelocoton,
];

// foto de la caminata con forma de polaroid: la inclinacion y la cinta salen de la posicion de la foto en la edicion
// descripcion es el alt de la imagen: el epigrafe es un texto aparte y no siempre describe lo que se ve
function PolaroidCard({ foto, indice, descripcion }) {
  return (
    <figure
      className={`${styles.polaroid} ${foto.epigrafe ? "" : styles.sinEpigrafe}`}
      style={{ "--giro": `${rotacionPolaroid(indice)}deg` }}
    >
      {/* la cinta es solo decoracion, por eso se oculta para los lectores de pantalla */}
      <span
        className={`${styles.cinta} ${CINTAS[indice % CINTAS.length]}`}
        aria-hidden="true"
      />
      <div className={styles.marco}>
        <img
          src={foto.url}
          alt={descripcion}
          className={styles.imagen}
          loading="lazy"
        />
      </div>
      {/* sin epigrafe no se dibuja el figcaption vacio: el marco de abajo lo completa .sinEpigrafe */}
      {foto.epigrafe && (
        <figcaption className={styles.epigrafe}>{foto.epigrafe}</figcaption>
      )}
    </figure>
  );
}

export default PolaroidCard;
