import { useEffect } from "react";

// fija el alto con el que el fondo ubica sus decoraciones: el mayor alto que tuvo la pagina con el ancho actual
// las decoraciones se ubican en % del alto de la pagina, y al filtrar obras o productos la pagina se achica: sin esto todo el fondo se corria de lugar
// recibe el ref de la pagina (la que se mide) y el del fondo (donde se escribe el alto); escribe directo en su style para no re-renderizar nada
function useAltoFondo(paginaRef, fondoRef) {
  useEffect(() => {
    const pagina = paginaRef.current;
    const fondo = fondoRef.current;
    let anchoAnterior = 0;
    let altoMaximo = 0;

    // el navegador avisa cada vez que la pagina cambia de tamaño
    const observador = new ResizeObserver(([entrada]) => {
      const { width, height } = entrada.contentRect;
      // si cambio el ancho (girar el celular, achicar la ventana) el contenido se acomoda distinto y se empieza de cero
      // si solo cambio el alto (cargaron tarjetas o se filtro una lista) solo se acepta que crezca, asi el fondo no se mueve al filtrar
      altoMaximo = width === anchoAnterior ? Math.max(altoMaximo, height) : height;
      anchoAnterior = width;
      fondo.style.setProperty("--alto-fondo", `${altoMaximo}px`);
    });
    observador.observe(pagina);

    // cleanup: al salir de la landing se deja de observar
    return () => observador.disconnect();
  }, [paginaRef, fondoRef]);
}

export default useAltoFondo;
