import { useId, useRef } from "react";
import useAltoFondo from "../hooks/useAltoFondo";
import useAparecer from "../hooks/useAparecer";
import useFondoReactivo from "../hooks/useFondoReactivo";
import styles from "./FondoArtistico.module.css";

// luces suaves de colores que respiran muy despacio detras de todo
// profundidad: cuanto se mueven al hacer scroll (negativo = suben mas lento que la pagina, se sienten lejos)
const LUCES = [
  { color: "ladrillo", x: "-10%", arriba: "3%", tam: 38, duracion: 22, profundidad: -0.06 },
  { color: "salvia", x: "68%", arriba: "18%", tam: 42, duracion: 26, profundidad: -0.1 },
  { color: "ocre", x: "-14%", arriba: "40%", tam: 40, duracion: 24, profundidad: -0.07 },
  { color: "arena", x: "64%", arriba: "56%", tam: 44, duracion: 28, profundidad: -0.12 },
  { color: "ladrillo", x: "18%", arriba: "78%", tam: 38, duracion: 25, profundidad: -0.08 },
];

// pares de colores de la paleta: cada pincelada va de uno al otro, como pintura que se mezcla
const MEZCLAS = {
  "ladrillo-arena": ["var(--color-soft-brick)", "var(--color-soft-sand)"],
  "salvia-ladrillo": ["var(--color-soft-green)", "var(--color-soft-brick)"],
  "arena-salvia": ["var(--color-soft-sand)", "var(--color-soft-green)"],
  "ocre-ladrillo": ["var(--color-soft-ochre)", "var(--color-soft-brick)"],
  "ladrillo-ocre": ["var(--color-soft-brick)", "var(--color-soft-ochre)"],
  ocre: ["var(--color-soft-ochre)", "var(--color-soft-ochre)"],
  ladrillo: ["var(--color-soft-brick)", "var(--color-soft-brick)"],
  salvia: ["var(--color-soft-green)", "var(--color-soft-green)"],
  arena: ["var(--color-soft-sand)", "var(--color-soft-sand)"],
};

// trazos de pincel y de resaltador; x e arriba son % de la pagina, ancho en rem
// van repartidos por toda la landing, cruzando de una seccion a otra, y casi siempre asomando por los costados de lo que hay arriba
const TRAZOS = [
  { estilo: "resaltador", mezcla: "ocre", forma: "recta", x: "55%", arriba: "15.5%", ancho: 22, giro: 3, profundidad: 0.03 },
  { estilo: "pincel", mezcla: "salvia-ladrillo", forma: "curva", x: "-5%", arriba: "24%", ancho: 28, giro: 8, profundidad: -0.08 },
  { estilo: "resaltador", mezcla: "ladrillo", forma: "recta", x: "62%", arriba: "34%", ancho: 22, giro: -4, profundidad: 0.04 },
  { estilo: "pincel", mezcla: "arena-salvia", forma: "suave", x: "40%", arriba: "42%", ancho: 30, giro: -9, profundidad: -0.06 },
  { estilo: "resaltador", mezcla: "salvia", forma: "recta", x: "-3%", arriba: "50%", ancho: 22, giro: 5, profundidad: 0.03 },
  { estilo: "pincel", mezcla: "ocre-ladrillo", forma: "ola", x: "58%", arriba: "58%", ancho: 28, giro: 7, profundidad: -0.09 },
  { estilo: "resaltador", mezcla: "arena", forma: "recta", x: "4%", arriba: "66%", ancho: 20, giro: -5, profundidad: 0.04 },
  { estilo: "pincel", mezcla: "ladrillo-ocre", forma: "curva", x: "50%", arriba: "76%", ancho: 30, giro: -8, profundidad: -0.06 },
  { estilo: "resaltador", mezcla: "ocre", forma: "recta", x: "-2%", arriba: "82%", ancho: 22, giro: 4, profundidad: 0.03 },
];

// recorridos posibles de un trazo, en un lienzo de 200 x 60
const FORMAS_TRAZO = {
  ola: "M8 42C40 6 70 6 100 30S160 54 192 18",
  curva: "M10 50C60 8 140 8 190 46",
  suave: "M8 22Q50 54 100 32T192 38",
  recta: "M8 32L192 26",
};

// bandas de lineas finas que ondulan, como curvas de nivel o hilos de color; arriba en % de la pagina
// la primera queda bajo el hero, sin cruzar sus bloques
const BANDAS = [{ arriba: "14%" }, { arriba: "46%" }, { arriba: "83%" }];
const LINEAS_POR_BANDA = 9;

// arma una onda que cruza un lienzo de 1200 de ancho; la amplitud y la fase hacen que cada linea sea distinta
// todas tienen los mismos comandos, que es lo que hace falta para que el navegador pueda pasar de una a otra
function onda(y, amplitud, fase) {
  return `M0 ${y} C 200 ${y - amplitud + fase}, 360 ${y + amplitud - fase}, 600 ${y} S 1000 ${y - amplitud + fase}, 1200 ${y}`;
}

// pincelada: varias capas del mismo recorrido (base con degradado, cerdas claras y cerdas oscuras) y bordes rugosos con un filtro svg
// se dibuja de punta a punta cuando la persona llega a esa parte de la pagina
function PinceladaSvg({ forma, mezcla, idGradiente }) {
  const recorrido = FORMAS_TRAZO[forma];
  const [color1, color2] = MEZCLAS[mezcla];
  return (
    <>
      <defs>
        <linearGradient id={idGradiente} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: color1 }} />
          <stop offset="1" style={{ stopColor: color2 }} />
        </linearGradient>
      </defs>
      <path className={styles.base} d={recorrido} pathLength="1" stroke={`url(#${idGradiente})`} />
      {/* cerdas: lineas finas paralelas, unas claras y otras de tono tierra, para que parezca pintura con textura y no una cinta lisa */}
      <path className={styles.cerdaClara} d={recorrido} pathLength="1" transform="translate(0 -3)" />
      <path className={styles.cerdaClara} d={recorrido} pathLength="1" transform="translate(0 2.5)" />
      <path className={styles.cerdaOscura} d={recorrido} pathLength="1" transform="translate(0 5)" />
    </>
  );
}

function Trazo({ estilo, mezcla, forma, x, arriba, ancho, giro, profundidad }) {
  const [ref, visible] = useAparecer();
  // useId devuelve ids con dos puntos (":r1:") que rompen el url(#...) de css, por eso se sacan
  const idGradiente = `degradado${useId().replace(/:/g, "")}`;
  const [color1, color2] = MEZCLAS[mezcla];

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 60"
      className={`${styles.trazo} ${styles[estilo]} ${visible ? styles.dibujando : ""}`}
      style={{ "--x": x, "--arriba": arriba, "--ancho": `${ancho}rem`, "--giro": `${giro}deg`, "--profundidad": profundidad }}
      aria-hidden="true"
    >
      {estilo === "pincel" ? (
        <PinceladaSvg forma={forma} mezcla={mezcla} idGradiente={idGradiente} />
      ) : (
        <>
          <defs>
            <linearGradient id={idGradiente} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" style={{ stopColor: color1 }} />
              <stop offset="1" style={{ stopColor: color2 }} />
            </linearGradient>
          </defs>
          <path className={styles.marcador} d={FORMAS_TRAZO[forma]} pathLength="1" stroke={`url(#${idGradiente})`} />
        </>
      )}
    </svg>
  );
}

// una banda de lineas finas; cada linea ondula distinto, asi el conjunto parece respirar
function Banda({ arriba }) {
  // con menos movimiento las lineas quedan quietas
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <svg viewBox="0 0 1200 160" preserveAspectRatio="none" className={styles.banda} style={{ "--arriba": arriba }} aria-hidden="true">
      {Array.from({ length: LINEAS_POR_BANDA }, (_, i) => {
        const y = 30 + i * 12;
        const amplitud = 14 + i * 3;
        return (
          <path key={i} className={styles.linea} d={onda(y, amplitud, 0)}>
            {!quieto && (
              <animate
                attributeName="d"
                dur={`${16 + i}s`}
                begin={`-${i * 1.3}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keyTimes="0;0.5;1"
                keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
                values={`${onda(y, amplitud, 0)};${onda(y, amplitud * 0.45, 26)};${onda(y, amplitud, 0)}`}
              />
            )}
          </path>
        );
      })}
    </svg>
  );
}

// envuelve la landing y le pone detras un fondo de arte digital: papel con grano, luces que respiran, pinceladas, lineas fluidas y una luz que sigue al cursor
// todo es decoracion pura: se oculta para lectores de pantalla, no recibe toques ni foco, y va detras del contenido
function FondoArtistico({ children }) {
  const paginaRef = useRef(null);
  const fondoRef = useRef(null);
  const focoRef = useRef(null);
  useAltoFondo(paginaRef, fondoRef);
  useFondoReactivo(fondoRef, focoRef);

  return (
    <div className={styles.pagina} ref={paginaRef}>
      {/* filtros que usan las pinceladas: ruido que desplaza los bordes para que queden irregulares como pintura de verdad */}
      <svg className={styles.filtros} aria-hidden="true">
        <defs>
          <filter id="pincelRugoso" x="-5%" y="-40%" width="110%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.35" numOctaves="2" seed="7" result="ruido" />
            <feDisplacementMap in="SourceGraphic" in2="ruido" scale="9" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
          <filter id="marcadorSeco" x="-5%" y="-40%" width="110%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.8" numOctaves="2" seed="3" result="ruido" />
            <feDisplacementMap in="SourceGraphic" in2="ruido" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className={styles.fondo} ref={fondoRef} aria-hidden="true">
        {LUCES.map((luz, indice) => (
          // el span externo se mueve con el scroll y el interno respira: son dos animaciones y no se pisan
          <span
            key={indice}
            className={styles.luzExterna}
            style={{ "--x": luz.x, "--arriba": luz.arriba, "--tam": `${luz.tam}rem`, "--profundidad": luz.profundidad }}
          >
            <span className={`${styles.luz} ${styles[`luz_${luz.color}`]}`} style={{ "--duracion": `${luz.duracion}s` }} />
          </span>
        ))}
        {BANDAS.map((banda, indice) => (
          <Banda key={indice} {...banda} />
        ))}
        {TRAZOS.map((trazo, indice) => (
          <Trazo key={indice} {...trazo} />
        ))}
      </div>

      {/* luz que acompaña al cursor, con un retraso suave para que se sienta liviana */}
      <div className={styles.foco} ref={focoRef} aria-hidden="true" />
      {/* grano de papel: una textura finita sobre todo, que le saca lo plano a la pantalla */}
      <div className={styles.grano} aria-hidden="true" />

      {children}
    </div>
  );
}

export default FondoArtistico;
