import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

// componente raiz: define que pagina se muestra en cada ruta
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* el panel solo se muestra con sesion iniciada; ProtectedRoute redirige al login si no la hay */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      {/* el asterisco atrapa cualquier ruta que no coincidio con las de arriba */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
