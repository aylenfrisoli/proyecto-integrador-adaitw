import { useState } from "react";
import useAnimacionAlTocar from "../hooks/useAnimacionAlTocar";
import useAparecer from "../hooks/useAparecer";
import styles from "./Silueta.module.css";

// los que vuelan, ademas de mecerse suben y bajan despacito
const VUELAN = ["mariposa", "abeja"];

// silueta natural de un solo color que decora la landing: brota al llegar, se mece como con brisa, se sacude al tocarla y se mueve distinto con el scroll
// tipo: abeja | flor | helecho | hoja | hongo | margarita | mariposa | montanas | pajaro | piedras | rama | semilla
// color: salvia | musgo | tierra | ocre | ladrillo (el dibujo es siempre un solo color, lo pone el css)
// sin lado queda en el flujo de la pagina; con lado (izquierda | derecha) y arriba (ej: "30%") se saca del flujo, y la seccion tiene que ser position: relative
// dentro: va sobre el contenedor de la seccion (desde 900px) y no en el margen; giro en grados; profundidad entre -1 y 1 (negativa = se siente lejos)
function Silueta({
  tipo = "hoja",
  color = "salvia",
  tamano = "4rem",
  lado,
  dentro = false,
  arriba,
  giro = 0,
  profundidad = 0,
}) {
  const [ref, visible] = useAparecer();
  const [sacudiendo, eventos] = useAnimacionAlTocar("sacudir");
  // la fase desfasa el meceo para que dos siluetas juntas no se muevan igual; se calcula una sola vez para que no cambie en cada render
  const [fase] = useState(() => `-${(Math.random() * 6).toFixed(1)}s`);

  const clasesPosicion = [
    styles.posicion,
    lado ? (dentro ? styles.dentro : styles.fuera) : "",
    lado ? styles[lado] : "",
  ].join(" ");

  const clasesFigura = [
    styles.figura,
    styles[tipo],
    styles[color],
    VUELAN.includes(tipo) ? styles.vuela : "",
    visible ? styles.visible : "",
    sacudiendo ? styles.sacudida : "",
  ].join(" ");

  return (
    // son solo decoracion: se ocultan para los lectores de pantalla y no hace falta usarlas con teclado
    // el span de afuera se mueve con el scroll y el de adentro se mece: son dos animaciones y no se pisan
    <span
      ref={ref}
      className={clasesPosicion}
      style={{ "--tamano": tamano, "--arriba": arriba, "--profundidad": profundidad }}
      aria-hidden="true"
    >
      <span className={clasesFigura} style={{ "--giro": `${giro}deg`, "--fase": fase }} {...eventos} />
    </span>
  );
}

export default Silueta;
