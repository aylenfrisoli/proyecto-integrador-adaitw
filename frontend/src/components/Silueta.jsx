import { useState } from "react";
import useAnimacionAlTocar from "../hooks/useAnimacionAlTocar";
import useAparecer from "../hooks/useAparecer";
import styles from "./Silueta.module.css";

// ancho y alto del svg de cada dibujo: la caja toma esa proporcion y no sobra aire alrededor
const PROPORCIONES = {
  alga: [100, 150],
  amapola: [100, 150],
  caracola: [100, 100],
  concha: [100, 84],
  diente: [100, 150],
  espiga: [80, 150],
  eucalipto: [100, 150],
  helecho: [100, 150],
  mariposa: [100, 100],
  olivo: [100, 150],
  pampa: [100, 150],
  pluma: [70, 150],
};

// los que vuelan, ademas de mecerse flotan despacito
const VUELAN = ["mariposa"];

// pieza de herbario de un solo color que decora la landing: crece desde la base al llegar, se mece como con brisa, recibe un soplo al tocarla y se mueve distinto con el scroll
// tipo: alga | amapola | caracola | concha | diente | espiga | eucalipto | helecho | mariposa | olivo | pampa | pluma
// color: salvia | musgo | tierra | ocre | ladrillo (el dibujo es siempre un solo color, con un lavado suave y la linea mas firme; lo pone el css)
// tamano es el ancho; el alto sale de la proporcion del dibujo
// sin lado queda en el flujo de la pagina; con lado (izquierda | derecha) y arriba (ej: "30%") se saca del flujo, y la seccion tiene que ser position: relative
// dentro: va sobre el contenedor de la seccion (desde 900px) y no en el margen; sangre: cuanto se sale del borde de la pantalla (ej: "2rem")
// giro en grados; profundidad entre -1 y 1 (negativa = se siente lejos)
function Silueta({
  tipo = "olivo",
  color = "musgo",
  tamano = "4rem",
  lado,
  dentro = false,
  arriba,
  sangre = "0rem",
  giro = 0,
  profundidad = 0,
}) {
  const [ref, visible] = useAparecer();
  const [soplando, eventos] = useAnimacionAlTocar("soplo");
  // la fase desfasa el meceo para que dos piezas juntas no se muevan igual; se calcula una sola vez para que no cambie en cada render
  const [fase] = useState(() => `-${(Math.random() * 8).toFixed(1)}s`);
  const [ancho, alto] = PROPORCIONES[tipo];

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
    soplando ? styles.soplo : "",
  ].join(" ");

  return (
    // son solo decoracion: se ocultan para los lectores de pantalla y no hace falta usarlas con teclado
    // el span de afuera se mueve con el scroll y el de adentro se mece: son dos animaciones y no se pisan
    <span
      ref={ref}
      className={clasesPosicion}
      style={{
        "--tamano": tamano,
        "--arriba": arriba,
        "--sangre": sangre,
        "--profundidad": profundidad,
        aspectRatio: `${ancho} / ${alto}`,
      }}
      aria-hidden="true"
    >
      <span className={clasesFigura} style={{ "--giro": `${giro}deg`, "--fase": fase }} {...eventos} />
    </span>
  );
}

export default Silueta;
