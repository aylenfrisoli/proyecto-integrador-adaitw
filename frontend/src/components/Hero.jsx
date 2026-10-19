import useFetch from "../hooks/useFetch";
import Bandas from "./Bandas";
import Forma from "./Forma";
import styles from "./Hero.module.css";

// portada de la landing: titular enorme con formas animadas, una foto, la bajada y dos botones
function Hero() {
  // la foto la carga sara desde el panel; mientras llega, o si no hay, queda el bloque de color (no se muestra ningun error)
  const { data: configuracion } = useFetch("/configuracion");
  const imagenPortada = configuracion?.imagenPortada;

  return (
    <section id="inicio" className={styles.hero}>
      {/* decoracion de fondo: lineas onduladas abajo y formas sueltas arriba, todas detras del contenido */}
      <Bandas color="sky" className={styles.bandas} />
      <Forma tipo="pincel" colores={["rose", "sky"]} duracion={4} className={styles.pincel} />
      <Forma tipo="paleta" colores={["wood", "rose", "sky", "plum", "olive", "yellow"]} className={styles.paleta} />
      <Forma tipo="gota" colores={["rose"]} duracion={3.2} className={styles.gotaRosa} />
      <Forma tipo="gota" colores={["lilac"]} duracion={4} className={styles.gotaLila} />
      <Forma tipo="pomo" colores={["sky", "sky"]} className={styles.pomo} />

      <div className={`container ${styles.contenido}`}>
        <h1 className={styles.titulo}>
          {/* cada renglon es un flex para poder poner una forma al lado del texto; las formas van ocultas para los lectores de pantalla */}
          <span className={styles.renglon}>
            <span className={styles.colores}>Colores,</span>
            <Forma tipo="flor" colores={["yellow", "sky"]} duracion={22} ancho="0.72em" alto="0.72em" />
          </span>
          <span className={`${styles.renglon} ${styles.segundo}`}>
            <Forma tipo="blob" colores={["sky"]} ancho="0.8em" alto="0.62em" />
            formas y
          </span>
          <span className={`${styles.renglon} ${styles.tercero}`}>
            <span className={styles.acento}>texturas</span>
            <Forma tipo="sol" colores={["yellow"]} ancho="0.62em" alto="0.62em" />
          </span>
        </h1>

        <div className={styles.pie}>
          {/* el marco es solo pintura en css: simula un cuadro colgado, en el amarillo de las formas del titular */}
          <div className={styles.marco}>
            <div className={styles.foto}>
              {imagenPortada && <img src={imagenPortada} alt="Una obra de Sara Figarra" className={styles.imagen} />}
              <span className={styles.sello}>Sara A. Figarra</span>
            </div>
          </div>

          <div>
            <p className={styles.bajada}>
              Obras, productos y talleres creativos de SAF Creaciones para Vos.
              Cada pieza es única y está hecha con dedicación y calidez.
            </p>
            <div className={styles.acciones}>
              <a href="#obras" className={`btn btn-primary ${styles.boton}`}>
                Ver obras
                <span className={styles.flecha} aria-hidden="true">
                  →
                </span>
              </a>
              <a href="#talleres" className={`btn btn-outline ${styles.boton} ${styles.botonSimple}`}>
                Conocer los talleres
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
