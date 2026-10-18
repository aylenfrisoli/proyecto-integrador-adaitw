import { useState } from "react";
import { SECCIONES } from "../config/secciones";
import styles from "./Navbar.module.css";

// barra de navegacion flotante con forma de pastilla; en celular los links se despliegan en un panel azul con un boton
function Navbar() {
  const [abierto, setAbierto] = useState(false);

  // al tocar un link se cierra el menu, si no quedaria tapando la seccion a la que saltamos
  const cerrarMenu = () => setAbierto(false);

  return (
    <header className={styles.navbar}>
      <nav className={styles.barra} aria-label="Principal">
        <a href="#inicio" className={styles.logo} onClick={cerrarMenu}>
          <span className={styles.marca}>SAF</span>
          <span className={styles.nombre}>Creaciones para Vos</span>
        </a>

        {/* desktop: links en fila; en celular esta lista se oculta y se usa el boton de abajo */}
        <ul className={styles.links}>
          {SECCIONES.map((seccion) => (
            <li key={seccion.id}>
              <a href={`#${seccion.id}`} className={styles.link}>
                {seccion.nombre}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
          aria-controls="menu-principal"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        >
          {abierto ? "Cerrar" : "Menú"}
        </button>
      </nav>

      {abierto && (
        <ul id="menu-principal" className={styles.menuMovil}>
          {SECCIONES.map((seccion, indice) => (
            <li key={seccion.id}>
              <a href={`#${seccion.id}`} className={styles.linkMovil} onClick={cerrarMenu}>
                {seccion.nombre}
                {/* numero de orden en cifras de dos digitos: 01, 02... */}
                <span className={styles.numero}>{String(indice + 1).padStart(2, "0")}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

export default Navbar;
