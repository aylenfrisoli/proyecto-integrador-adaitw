import { useEffect, useState } from "react";
import { API_URL } from "../config/api";

// pide datos a la api con GET y devuelve { data, loading, error, recargar }
// si cambia la ruta (ej: otro filtro) vuelve a pedir, y recargar() fuerza un pedido nuevo (ej: despues de crear o borrar algo)
function useFetch(ruta) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // un contador que solo sirve para disparar el efecto de nuevo: cada recargar() lo sube en uno
  const [version, setVersion] = useState(0);

  useEffect(() => {
    // el controller permite cancelar el pedido si el componente se desmonta o la ruta cambia antes de que llegue la respuesta
    const controller = new AbortController();

    async function cargarDatos() {
      setLoading(true);
      setError(null);
      // se limpia la data vieja para que, si la ruta nueva falla, no quede mostrando resultados de la ruta anterior
      setData(null);

      try {
        const respuesta = await fetch(`${API_URL}${ruta}`, {
          signal: controller.signal,
        });
        const cuerpo = await respuesta.json();

        // fetch no falla con un 404 o un 500, por eso hay que mirar respuesta.ok a mano
        if (!respuesta.ok) {
          throw new Error(cuerpo.message || "No se pudieron cargar los datos");
        }

        setData(cuerpo);
        setLoading(false);
      } catch (err) {
        // un pedido cancelado no es un error real: ya hay otro en camino o el componente no existe mas, asi que no tocamos el estado
        if (err.name === "AbortError") return;

        // si la api esta apagada o devuelve algo que no es json, err.message seria un texto tecnico; mostramos uno claro
        setError(
          err instanceof SyntaxError || err instanceof TypeError
            ? "No pudimos conectar con el servidor, intenta de nuevo en unos minutos"
            : err.message,
        );
        setLoading(false);
      }
    }

    cargarDatos();

    // limpieza del efecto: se corre al desmontar o antes de volver a ejecutar el efecto
    return () => controller.abort();
  }, [ruta, version]);

  // la funcion actualizadora (v => v + 1) evita depender del valor viejo del contador
  const recargar = () => setVersion((v) => v + 1);

  return { data, loading, error, recargar };
}

export default useFetch;
