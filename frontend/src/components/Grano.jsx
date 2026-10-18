import styles from "./Grano.module.css";

// textura de papel con grano fino sobre toda la pagina: le saca lo plano a los colores
// es solo decoracion: no recibe clics ni foco y se oculta para los lectores de pantalla
function Grano() {
  return <div className={styles.grano} aria-hidden="true" />;
}

export default Grano;
