import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// envuelve una pagina privada: sin sesion manda al login, con sesion muestra la pagina (children)
function ProtectedRoute({ children }) {
  const { estaLogueada } = useAuth();

  // replace reemplaza la entrada del historial, asi el boton "atras" no vuelve a una pagina que redirige de nuevo
  if (!estaLogueada) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
