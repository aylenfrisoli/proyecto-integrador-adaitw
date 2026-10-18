import styles from "./Forma.module.css";

// pasa el nombre de un color de la paleta (el token de index.css sin el prefijo) a su var() de css
// ej: "rose-soft" -> var(--color-rose-soft)
const color = (nombre) => `var(--color-${nombre})`;

// giro de cada uno de los seis petalos de la flor
const GIROS_PETALOS = [0, 60, 120, 180, 240, 300];

// lugar de cada mancha de la paleta, en % desde la izquierda y desde arriba
const MANCHAS_PALETA = [
  [22, 22],
  [44, 14],
  [64, 24],
  [20, 48],
  [38, 66],
];

// salpicaduras de la acuarela: lugar y tamano en % del cuadro, mas cuanta opacidad tiene cada una
const SALPICADURAS = [
  { x: 78, y: 18, tamano: 12, opacidad: 0.8 },
  { x: 70, y: 74, tamano: 16, opacidad: 0.7 },
  { x: 4, y: 78, tamano: 9, opacidad: 0.8 },
];

// cada dibujo recibe la lista de colores y arma sus spans; el orden de los colores de cada uno esta en su comentario

// colores: [petalo, centro]
function Flor({ colores, duracion = 20 }) {
  return (
    <span
      className={styles.flor}
      style={{ "--petalo": color(colores[0]), "--centro": color(colores[1]), "--duracion": `${duracion}s` }}
    >
      {GIROS_PETALOS.map((giro) => (
        <span key={giro} className={styles.petalo} style={{ "--giro": `${giro}deg` }} />
      ))}
      <span className={styles.centroFlor} />
    </span>
  );
}

// colores: [color]
function Sol({ colores }) {
  return <span className={styles.sol} style={{ "--color": color(colores[0]) }} />;
}

// colores: [color]
function Blob({ colores }) {
  return <span className={styles.blob} style={{ "--color": color(colores[0]) }} />;
}

// colores: [ala de arriba, ala de abajo]; duracion es lo que tarda un aleteo y vuela la hace pasearse
function Mariposa({ colores, duracion = 1, vuela }) {
  const variables = {
    "--ala": color(colores[0]),
    "--ala-baja": color(colores[1]),
    "--aleteo": `${duracion}s`,
    // pasear lleva siete veces lo que un aleteo, asi se mueve mucho mas despacio de lo que bate las alas
    "--vuelo": `${(duracion * 7).toFixed(1)}s`,
  };

  // las dos mitades son iguales y se espejan por css
  const lado = (nombre) => (
    <span className={`${styles.lado} ${styles[nombre]}`}>
      <span className={styles.alaAlta} />
      <span className={styles.alaBaja} />
    </span>
  );

  return (
    <span className={`${styles.mariposa} ${vuela ? styles.vuela : ""}`} style={variables}>
      {lado("izquierda")}
      {lado("derecha")}
      <span className={styles.cuerpo} />
    </span>
  );
}

// colores: [mango, punta]
function Pincel({ colores, duracion = 4 }) {
  return (
    <span
      className={styles.pincel}
      style={{ "--mango": color(colores[0]), "--punta": color(colores[1]), "--duracion": `${duracion}s` }}
    >
      <span className={styles.movil}>
        <span className={styles.mango} />
        <span className={styles.virola} />
        <span className={styles.punta} />
      </span>
    </span>
  );
}

// colores: [mango, pintura]
function Brocha({ colores, duracion = 5 }) {
  return (
    <span
      className={styles.brocha}
      style={{ "--mango": color(colores[0]), "--pintura": color(colores[1]), "--duracion": `${duracion}s` }}
    >
      <span className={styles.movil}>
        <span className={styles.mango} />
        <span className={styles.virola} />
        <span className={styles.cerdas} />
        <span className={styles.gotaBrocha} />
      </span>
    </span>
  );
}

// colores: [fondo, ...manchas]; las manchas se reparten una por una y volviendo a empezar si hay menos colores que manchas
function Paleta({ colores }) {
  const [fondo, ...manchas] = colores;

  return (
    <span className={styles.paleta} style={{ "--fondo": color(fondo) }}>
      <span className={styles.fondoPaleta} />
      {MANCHAS_PALETA.map(([x, y], indice) => (
        <span
          key={indice}
          className={styles.mancha}
          style={{ left: `${x}%`, top: `${y}%`, backgroundColor: color(manchas[indice % manchas.length]) }}
        />
      ))}
    </span>
  );
}

// colores: [cuerpo del tubo, pintura]
function Pomo({ colores }) {
  return (
    <span className={styles.pomo} style={{ "--cuerpo": color(colores[0]), "--pintura": color(colores[1]) }}>
      <span className={styles.tapa} />
      <span className={styles.tubo} />
      <span className={styles.cuello} />
      <span className={styles.pintura} />
    </span>
  );
}

// colores: [color]; el span de adentro gira la gota y el de afuera la sube y baja, asi las dos animaciones no se pisan
function Gota({ colores, duracion = 3.5 }) {
  return (
    <span className={styles.gota} style={{ "--color": color(colores[0]), "--duracion": `${duracion}s` }}>
      <span className={styles.cuerpoGota} />
    </span>
  );
}

// colores: [color]
function Lapiz({ colores }) {
  return (
    <span className={styles.lapiz} style={{ "--color": color(colores[0]) }}>
      <span className={styles.goma} />
      <span className={styles.banda} />
      <span className={styles.cuerpoLapiz} />
      <span className={styles.mina} />
    </span>
  );
}

// colores: [color]
function Acuarela({ colores }) {
  return (
    <span className={styles.acuarela} style={{ "--color": color(colores[0]) }}>
      <span className={styles.manchaAcuarela} />
      {SALPICADURAS.map((salpicadura, indice) => (
        <span
          key={indice}
          className={styles.salpicadura}
          style={{
            left: `${salpicadura.x}%`,
            top: `${salpicadura.y}%`,
            width: `${salpicadura.tamano}%`,
            height: `${salpicadura.tamano}%`,
            opacity: salpicadura.opacidad,
          }}
        />
      ))}
    </span>
  );
}

// el tipo que se pide en <Forma tipo="..." /> elige el dibujo
const DIBUJOS = {
  flor: Flor,
  sol: Sol,
  blob: Blob,
  mariposa: Mariposa,
  pincel: Pincel,
  brocha: Brocha,
  paleta: Paleta,
  pomo: Pomo,
  gota: Gota,
  lapiz: Lapiz,
  acuarela: Acuarela,
};

// forma decorativa animada: es solo adorno, por eso se oculta para los lectores de pantalla
// ancho y alto (en em) la dejan en linea dentro de un titular; sin ellos llena el espacio que le da className
function Forma({ tipo, colores, duracion, vuela, ancho, alto, className = "" }) {
  const Dibujo = DIBUJOS[tipo];
  const enLinea = ancho !== undefined;

  return (
    <span
      className={`${enLinea ? styles.enLinea : styles.bloque} ${className}`}
      style={enLinea ? { "--ancho": ancho, "--alto": alto } : undefined}
      aria-hidden="true"
    >
      <Dibujo colores={colores} duracion={duracion} vuela={vuela} />
    </span>
  );
}

export default Forma;
