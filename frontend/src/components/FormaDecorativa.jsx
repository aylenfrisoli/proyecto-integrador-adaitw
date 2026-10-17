import { useState } from "react";
import useAnimacionAlTocar from "../hooks/useAnimacionAlTocar";
import useAparecer from "../hooks/useAparecer";
import styles from "./FormaDecorativa.module.css";

// forma pastel chica que se repite en las secciones, como las del hero: aparece al llegar, flota, cambia de forma y salta al tocarla
// tipo: gota | arco | ovalo | cuarto. color: rosa | lila | azul | melocoton
// lado (izquierda | derecha) y arriba (ej: "30%") la sacan del flujo y la dejan asomando por el costado de la seccion, que tiene que ser position: relative
function FormaDecorativa({ tipo = "gota", color = "rosa", tamano = "3rem", lado, arriba }) {
  const [ref, visible] = useAparecer();
  const [saltando, eventos] = useAnimacionAlTocar("saltar");
  // la fase desfasa las animaciones para que dos formas juntas no se muevan igual; se calcula una sola vez para que no cambie en cada render
  const [fase] = useState(() => `-${(Math.random() * 5).toFixed(1)}s`);

  const clases = [
    styles.forma,
    styles[tipo],
    styles[color],
    lado ? `${styles.lateral} ${styles[lado]}` : "",
    visible ? styles.visible : "",
    saltando ? styles.salto : "",
  ].join(" ");

  return (
    // es solo decoracion: se oculta para los lectores de pantalla y no hace falta que se use con teclado
    <span
      ref={ref}
      className={clases}
      style={{ "--tamano": tamano, "--fase": fase, "--arriba": arriba }}
      aria-hidden="true"
      {...eventos}
    />
  );
}

export default FormaDecorativa;
