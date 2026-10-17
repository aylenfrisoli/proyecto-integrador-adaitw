import { useEffect } from "react";

// hace que el fondo artistico reaccione: el scroll mueve las capas a distinta velocidad (profundidad) y una luz sigue al cursor
// recibe los refs de la capa del fondo y de la luz; escribe directo en su style y no en un estado de react, porque cambia en cada frame
// y re-renderizar toda la landing 60 veces por segundo seria carisimo
function useFondoReactivo(fondoRef, focoRef) {
  useEffect(() => {
    // quien pidio menos movimiento en su sistema ve el fondo quieto
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fondo = fondoRef.current;
    const foco = focoRef.current;
    let cuadro = 0;

    function actualizarScroll() {
      cuadro = 0;
      fondo.style.setProperty("--scroll", window.scrollY);
    }

    // requestAnimationFrame junta todos los eventos de scroll de un frame en una sola actualizacion
    function alHacerScroll() {
      if (!cuadro) cuadro = requestAnimationFrame(actualizarScroll);
    }

    function alMoverElCursor(evento) {
      foco.style.transform = `translate3d(${evento.clientX}px, ${evento.clientY}px, 0)`;
      foco.style.opacity = "1";
    }

    actualizarScroll();
    // passive avisa al navegador que no se va a frenar el scroll, asi no espera a este codigo para scrollear
    window.addEventListener("scroll", alHacerScroll, { passive: true });
    window.addEventListener("pointermove", alMoverElCursor, { passive: true });

    // cleanup: al salir de la landing se sueltan los eventos y el frame pendiente
    return () => {
      window.removeEventListener("scroll", alHacerScroll);
      window.removeEventListener("pointermove", alMoverElCursor);
      cancelAnimationFrame(cuadro);
    };
  }, [fondoRef, focoRef]);
}

export default useFondoReactivo;
