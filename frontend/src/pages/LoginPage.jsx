import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./LoginPage.module.css";

// pantalla de acceso de la administradora: formulario controlado de email y contraseña
function LoginPage() {
  const { estaLogueada, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // si ya hay sesion no tiene sentido mostrar el login; esto tambien lleva al panel apenas el login sale bien
  if (estaLogueada) {
    return <Navigate to="/admin" replace />;
  }

  async function manejarEnvio(evento) {
    // sin esto el formulario recargaria la pagina y se perderia el estado de react
    evento.preventDefault();
    setError("");
    setEnviando(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
      // solo se reactiva el boton si fallo; si salio bien esta pagina se reemplaza por el panel
      setEnviando(false);
    }
  }

  return (
    <main className={styles.pagina}>
      <section className={styles.tarjeta}>
        <Link to="/" className={`brand-logo ${styles.logo}`}>
          SAF Creaciones para Vos
        </Link>
        <h1 className={`display-title ${styles.titulo}`}>Acceso al panel</h1>
        <p className={styles.bajada}>
          Ingresá con tu cuenta de administradora para gestionar el sitio.
        </p>

        <form onSubmit={manejarEnvio} className={styles.formulario}>
          <label className={styles.campo}>
            Email
            <input
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className={styles.campo}>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(evento) => setPassword(evento.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {/* role alert hace que los lectores de pantalla anuncien el error apenas aparece */}
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={enviando}
          >
            {enviando ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <Link to="/" className={styles.volver}>
          ← Volver al sitio
        </Link>
      </section>
    </main>
  );
}

export default LoginPage;
