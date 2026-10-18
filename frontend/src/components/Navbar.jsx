import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { SECCIONES } from "../config/secciones";
import logoHeader from "../img/logo-header-brown-recortado.png";
import styles from "./Navbar.module.css";

// barra de navegacion fija con fondo translucido; en celular los links se despliegan con un boton
function Navbar() {
  const [abierto, setAbierto] = useState(false);

  // al tocar un link se cierra el menu, si no quedaria tapando la seccion a la que saltamos
  const cerrarMenu = () => setAbierto(false);

  return (
    <header className={styles.navbar}>
      <nav className={`container ${styles.inner}`} aria-label="Principal">
        <a href="#inicio" className={styles.logo} onClick={cerrarMenu}>
          {/* el alt lleva el nombre completo porque el logo solo dice saf creaciones */}
          <img
            src={logoHeader}
            alt="SAF Creaciones para Vos"
            className={styles.logoImg}
            width="107"
            height="40"
          />
        </a>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
          aria-controls="menu-principal"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        >
          {abierto ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <ul
          id="menu-principal"
          className={`${styles.links} ${abierto ? styles.open : ""}`}
        >
          {SECCIONES.map((seccion) => (
            <li key={seccion.id}>
              <a
                href={`#${seccion.id}`}
                className={styles.link}
                onClick={cerrarMenu}
              >
                {seccion.nombre}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
