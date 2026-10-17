import { useEffect, useRef, useState } from "react";

// devuelve [ref, visible]: visible pasa a true la primera vez que el elemento entra en pantalla
// sirve para que una animacion de entrada arranque cuando la persona llega a la seccion y no al cargar la pagina
function useAparecer() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    // un navegador sin IntersectionObserver lo muestra de entrada, mejor eso que dejarlo invisible
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          // alcanza con verlo una vez: se deja de observar para que no vuelva a animarse
          observador.disconnect();
        }
      },
      // threshold 0.3: se considera visible cuando se ve al menos el 30% de la forma
      { threshold: 0.3 },
    );
    observador.observe(elemento);

    // cleanup: si el componente se desmonta antes de aparecer, se corta la observacion
    return () => observador.disconnect();
  }, []);

  return [ref, visible];
}

export default useAparecer;
