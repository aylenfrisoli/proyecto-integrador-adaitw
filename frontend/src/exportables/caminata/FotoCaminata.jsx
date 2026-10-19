import { giroFoto } from "../../utils/caminata";
import styles from "./FotoCaminata.module.css";

// foto de la caminata: un cuadrado de esquinas redondeadas con el epigrafe debajo; al pasar el mouse se inclina un poco
// la inclinacion sale de la posicion de la foto en la edicion
// descripcion es el alt de la imagen: el epigrafe es un texto aparte y no siempre describe lo que se ve
function FotoCaminata({ foto, indice, descripcion }) {
  return (
    <figure className={styles.foto} style={{ "--giro": `${giroFoto(indice)}deg` }}>
      <div className={styles.marco}>
        <img
          src={foto.url}
          alt={descripcion}
          className={styles.imagen}
          loading="lazy"
        />
      </div>
      {/* sin epigrafe no se dibuja el figcaption vacio */}
      {foto.epigrafe && (
        <figcaption className={styles.epigrafe}>{foto.epigrafe}</figcaption>
      )}
    </figure>
  );
}

export default FotoCaminata;
