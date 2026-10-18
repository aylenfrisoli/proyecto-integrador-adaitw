import { useState } from "react";
import styles from "./Hero.module.css";

// los cuatro bloques del collage; el id coincide con la clase de css que les da color, lugar y forma
const BLOQUES = ["ladrillo", "salvia", "arena", "ocre"];

// portada de la landing: titular grande, dos botones y un collage decorativo hecho con css que se anima solo y salta al tocarlo
function Hero() {
  // id del bloque que esta saltando, null si ninguno; con un solo estado alcanza porque saltan de a uno
  const [saltando, setSaltando] = useState(null);

  // el evento animationend llega por cada animacion que termina (tambien la de entrada), por eso se mira cual fue
  // las infinitas nunca terminan; el nombre de la animacion lo modifica css modules, por eso se busca con includes
  function terminarAnimacion(evento) {
    if (evento.animationName.includes("saltar")) {
      setSaltando(null);
    }
  }

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

      {/* es solo decoracion, por eso se oculta para los lectores de pantalla y no hace falta que se pueda usar con teclado */}
      <div className={styles.collage} aria-hidden="true">
        {BLOQUES.map((id) => (
          <span
            key={id}
            className={`${styles.bloque} ${styles[id]} ${saltando === id ? styles.salto : ""}`}
            onClick={() => setSaltando(id)}
            onAnimationEnd={terminarAnimacion}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
