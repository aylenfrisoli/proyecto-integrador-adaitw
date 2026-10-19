import { Fragment } from "react";
import Forma from "./Forma";
import styles from "./Marquee.module.css";

// palabras de la cinta: los materiales y trabajos de sara
const PALABRAS = ["Pinturas", "Cajas", "Bordados", "Bolsos", "Papelería", "Collages", "Talleres", "Murales"];

// una forma chica entre palabra y palabra; se reparten una por una y volviendo a empezar
const FORMAS = [
  { tipo: "pincel", colores: ["rose", "navy"], duracion: 3 },
  { tipo: "paleta", colores: ["white", "rose", "sky", "plum", "olive", "rose-soft"] },
  { tipo: "gota", colores: ["sky"] },
  { tipo: "flor", colores: ["rose-soft", "plum"], duracion: 14 },
];

// una vuelta completa de la cinta
function Fila() {
  return (
    <div className={styles.fila}>
      {PALABRAS.map((palabra, indice) => (
        <Fragment key={palabra}>
          {/* las palabras de posicion impar van en letra manuscrita, para alternar con las de trazo grueso */}
          <span className={`${styles.palabra} ${indice % 2 ? styles.manuscrita : ""}`}>{palabra}</span>
          <Forma {...FORMAS[indice % FORMAS.length]} className={styles.forma} />
        </Fragment>
      ))}
    </div>
  );
}

// cinta amarilla inclinada que se desplaza sola entre la portada y los productos
// es solo decoracion (las mismas palabras estan en el resto de la pagina), por eso se oculta para los lectores de pantalla
function Marquee() {
  return (
    // el contenedor pinta de crema (portada) arriba y de azul (productos) abajo: es lo que se ve por los costados de la cinta girada
    <div className={styles.contenedor} aria-hidden="true">
      <div className={styles.cinta}>
        {/* la fila va dos veces: la pista se corre justo la mitad y vuelve a empezar, asi el movimiento no tiene saltos */}
        <div className={styles.pista}>
          <Fila />
          <Fila />
        </div>
      </div>
    </div>
  );
}

export default Marquee;
