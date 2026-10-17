import { createContext, useContext, useState } from "react";
import { API_URL } from "../config/api";
import { mensajeErrorLogin, tokenVigente } from "../utils/auth";

// clave con la que se guarda el token en localStorage
const CLAVE_TOKEN = "token";

const AuthContext = createContext(null);

// lee el token guardado; si ya vencio lo borra para no mostrar el panel con una sesion que la api va a rechazar
function leerTokenGuardado() {
  const token = localStorage.getItem(CLAVE_TOKEN);
  if (token && !tokenVigente(token)) {
    localStorage.removeItem(CLAVE_TOKEN);
    return null;
  }
  return token;
}

// guarda la sesion de la administradora y la comparte con toda la app
export function AuthProvider({ children }) {
  // se pasa la funcion y no su resultado, asi localStorage se lee una sola vez al montar y no en cada render
  const [token, setToken] = useState(leerTokenGuardado);

  // pide el token a la api y lo guarda; si algo sale mal lanza un Error con un mensaje listo para mostrar
  async function login(email, password) {
    let respuesta;
    try {
      respuesta = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      // fetch solo falla de este modo si no hay conexion con el servidor
      throw new Error(
        "No pudimos conectar con el servidor. Intentá de nuevo en unos minutos.",
      );
    }

    if (!respuesta.ok) {
      throw new Error(mensajeErrorLogin(respuesta.status));
    }

    const { token: tokenNuevo } = await respuesta.json();
    localStorage.setItem(CLAVE_TOKEN, tokenNuevo);
    setToken(tokenNuevo);
  }

  // cierra la sesion: borra el token del navegador y del estado
  function logout() {
    localStorage.removeItem(CLAVE_TOKEN);
    setToken(null);
  }

  const valor = { token, estaLogueada: Boolean(token), login, logout };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// atajo para usar el contexto desde cualquier componente: const { login } = useAuth()
export function useAuth() {
  return useContext(AuthContext);
}
