import { useLayoutEffect, useRef } from "react";
import { SECCIONES } from "../config/secciones";
import { initMobileMenu } from "../vendor/mobile-menu";
import styles from "./Navbar.module.css";

// desde este ancho (px) se ve la fila de links y el menu de celular se apaga; tiene que ser igual al media query de Navbar.module.css
const ANCHO_ESCRITORIO = 1000;

// los links del menu de celular salen de las mismas secciones que la fila de escritorio, asi no se repiten
const ITEMS_MENU = SECCIONES.map((seccion) => ({ label: seccion.nombre, href: `#${seccion.id}` }));

// barra de navegacion fija arriba, azul y de borde a borde; en celular un boton abre el menu a pantalla completa
function Navbar() {
  const headerRef = useRef(null);
  const botonRef = useRef(null);
  const menuRef = useRef(null);

  // la libreria del menu trabaja directo sobre el DOM (no es de react): se crea al montar y se destruye al desmontar
  // useLayoutEffect y no useEffect porque corre antes de pintar: asi el boton nunca se ve vacio un instante
  useLayoutEffect(() => {
    const menu = initMobileMenu({
      items: ITEMS_MENU,
      toggle: botonRef.current,
      toggleLabel: "Menú principal",
      panelLabel: "Menú de celular",
      breakpoint: ANCHO_ESCRITORIO,
      // los links #seccion los resuelve el navegador, que ya respeta scroll-padding-top y prefers-reduced-motion (ver index.css)
      smoothScroll: false,
      // el color y la capa (z-index) del panel se definen en Navbar.module.css, en la clase .panel
      className: styles.panel,
    });
    menuRef.current = menu;

    // el panel deja libre arriba el alto de la barra; se mide en vez de fijar un numero porque la barra puede crecer en pantallas muy angostas
    const header = headerRef.current;
    const medirBarra = () => menu.element.style.setProperty("--tmm-top", `${header.offsetHeight}px`);
    medirBarra();
    const observador = new ResizeObserver(medirBarra);
    observador.observe(header);

    return () => {
      observador.disconnect();
      menu.destroy();
      menuRef.current = null;
    };
  }, []);

  // el logo queda a la vista con el menu abierto: si se toca, se cierra para no dejar el panel tapando el inicio
  const cerrarMenu = () => menuRef.current?.close();

  return (
    <header ref={headerRef} className={styles.navbar}>
      <nav className={styles.barra} aria-label="Principal">
        <a href="#inicio" className={styles.logo} onClick={cerrarMenu}>
          <span className={styles.marca}>SAF</span>
          <span className={styles.nombre}>Creaciones para Vos</span>
        </a>

        {/* escritorio: links en fila; en celular esta lista se oculta y se usa el boton de abajo */}
        <ul className={styles.links}>
          {SECCIONES.map((seccion) => (
            <li key={seccion.id}>
              <a href={`#${seccion.id}`} className={styles.link}>
                {seccion.nombre}
              </a>
            </li>
          ))}
        </ul>

        {/* va vacio a proposito: la libreria le pone adentro las dos lineas que se vuelven una X y se encarga de aria-expanded
            por eso no se le pasa aria-expanded desde react, si no los dos se pisarian */}
        <button ref={botonRef} type="button" className={styles.toggle} />
      </nav>
    </header>
  );
}

export default Navbar;
