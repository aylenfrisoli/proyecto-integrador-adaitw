import styles from "./Hero.module.css";

// portada de la landing: titular grande, dos botones y un collage decorativo hecho solo con css
function Hero() {
  return (
    <section id="inicio" className={`container ${styles.hero}`}>
      <div>
        <p className={styles.eyebrow}>Artista plástica · Costa argentina</p>
        <h1 className={`display-title ${styles.titulo}`}>
          Color, forma y <span className={styles.acento}>alma</span> hechos a
          mano
        </h1>
        <p className={styles.bajada}>
          Obras, productos y talleres creativos de SAF Creaciones para Vos.
          Cada pieza es única y está hecha con dedicación y calidez.
        </p>
        <div className={styles.acciones}>
          <a href="#obras" className="btn btn-primary">
            Ver obras
          </a>
          <a href="#talleres" className="btn btn-outline">
            Conocer los talleres
          </a>
        </div>
      </div>

      {/* es solo decoracion, por eso se oculta para los lectores de pantalla */}
      <div className={styles.collage} aria-hidden="true">
        <span className={`${styles.bloque} ${styles.rosa}`} />
        <span className={`${styles.bloque} ${styles.azul}`} />
        <span className={`${styles.bloque} ${styles.lila}`} />
        <span className={`${styles.bloque} ${styles.melocoton}`} />
      </div>
    </section>
  );
}

export default Hero;
