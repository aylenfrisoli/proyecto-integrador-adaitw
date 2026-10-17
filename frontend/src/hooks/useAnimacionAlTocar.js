import { useState } from "react";

// animacion que se dispara al tocar un elemento y se apaga sola cuando termina
// devuelve [activa, eventos]: activa se usa para sumar la clase de css y eventos se esparce sobre el elemento
function useAnimacionAlTocar(nombre) {
  const [activa, setActiva] = useState(false);

  const eventos = {
    onClick: () => setActiva(true),
    // llega un animationend por cada animacion que termina, por eso se mira cual fue
    // css modules le cambia el nombre a la animacion, por eso se busca con includes
    onAnimationEnd: (evento) => {
      if (evento.animationName.includes(nombre)) {
        setActiva(false);
      }
    },
  };

  return [activa, eventos];
}

export default useAnimacionAlTocar;
