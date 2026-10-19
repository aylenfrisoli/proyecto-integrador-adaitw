import styles from "./Bandas.module.css";

const LINEAS = 9;

// arma una onda que cruza un lienzo de 1200 de ancho; la amplitud y la fase hacen que cada linea sea distinta
// todas tienen los mismos comandos, que es lo que hace falta para que el navegador pueda pasar de una a otra
function onda(y, amplitud, fase) {
  return `M0 ${y} C 200 ${y - amplitud + fase}, 360 ${y + amplitud - fase}, 600 ${y} S 1000 ${y - amplitud + fase}, 1200 ${y}`;
}

// bandas de lineas finas que ondulan, como curvas de nivel o hilos de color
// color es un nombre de la paleta (ej: "sky"); el lugar, el alto y la transparencia los pone quien la usa con className
function Bandas({ color, className = "" }) {
  // con menos movimiento las lineas quedan quietas (la animacion es de svg, asi que la regla de css no la alcanza)
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <svg
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      className={`${styles.bandas} ${className}`}
      style={{ "--linea": `var(--color-${color})` }}
      aria-hidden="true"
    >
      {Array.from({ length: LINEAS }, (_, i) => {
        const y = 30 + i * 12;
        const amplitud = 14 + i * 3;
        return (
          <path key={i} d={onda(y, amplitud, 0)}>
            {!quieto && (
              // cada linea ondula con su propio ritmo y empieza en otro momento, asi el conjunto parece respirar
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

export default Bandas;
