import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

// el router envuelve todo para que las rutas funcionen; el AuthProvider va adentro porque la sesion la usan las paginas
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    {/* mide las visitas en vercel; va afuera del router porque no depende de ninguna ruta */}
    <Analytics />
  </StrictMode>,
);
