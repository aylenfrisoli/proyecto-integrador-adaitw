import { API_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { mensajeErrorApi } from "../utils/api";

// devuelve pedir(ruta, { metodo, cuerpo }) para las acciones del panel (POST, PUT y DELETE), que necesitan el token
// si algo sale mal lanza un Error con un mensaje listo para mostrar
function useApi() {
  const { token, logout } = useAuth();

  async function pedir(ruta, { metodo = "GET", cuerpo } = {}) {
    let respuesta;
    try {
      respuesta = await fetch(`${API_URL}${ruta}`, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // un DELETE no lleva cuerpo, por eso solo se arma el json si hay algo que mandar
        body: cuerpo ? JSON.stringify(cuerpo) : undefined,
      });
    } catch {
      // fetch solo falla de este modo si no hay conexion con el servidor
      throw new Error(
        "No pudimos conectar con el servidor. Intentá de nuevo en unos minutos.",
      );
    }

    // catch a null porque algunas respuestas de error pueden venir sin cuerpo json
    const datos = await respuesta.json().catch(() => null);

    // 401 = token vencido o invalido: se cierra la sesion y ProtectedRoute manda al login
    if (respuesta.status === 401) {
      logout();
      throw new Error("Tu sesión venció. Volvé a iniciar sesión.");
    }

    if (!respuesta.ok) {
      throw new Error(mensajeErrorApi(respuesta.status, datos));
    }

    return datos;
  }

  return { pedir };
}

export default useApi;
