import useFetch from "../hooks/useFetch";
import Forma from "./Forma";
import styles from "./SobreSara.module.css";

// materiales y tecnicas con los que trabaja sara: las categorias del sitio y las que todavia no tienen productos
const MATERIALES = [
  "Pinturas",
  "Cajas",
  "Bordados",
  "Bolsos",
  "Papelería",
  "Collages",
  "Murales",
  "Cerámica",
  "Porcelana",
  "Decoupage",
];

// clases de color e inclinacion que se reparten entre las etiquetas, una por una y volviendo a empezar (hay seis y mas materiales)
const ETIQUETAS = [
  styles.blanca,
  styles.amarilla,
  styles.oscura,
  styles.celeste,
  styles.rosa,
  styles.crema,
];

// presentacion de sara: el titular grande arriba y debajo dos columnas, el retrato a la izquierda y el texto con las etiquetas a la derecha
function SobreSara() {
  const { data: configuracion } = useFetch("/configuracion");
  const imagenSobreSara = configuracion?.imagenSobreSara;

  return (
    <section id="sobre-sara" className={styles.seccion}>
      <div className="container">
        <h2 className={styles.titulo}>
          <span className={styles.renglon}>
            Cada pieza tiene su
            <Forma tipo="sol" colores={["white"]} ancho="0.6em" alto="0.6em" />
          </span>
          <span className={styles.acento}>propia historia</span>
        </h2>

        <div className={styles.columnas}>
          {/* parados sobre las columnas, a la derecha del titular, donde no hay texto; solo en pantallas anchas */}
          <Forma tipo="pincel" colores={["yellow", "white"]} duracion={4.5} className={`${styles.deco} ${styles.solo} ${styles.pincel}`} />
          <Forma tipo="mariposa" colores={["yellow", "white"]} vuela className={`${styles.deco} ${styles.solo} ${styles.mariposa}`} />
          <Forma tipo="gota" colores={["white"]} duracion={3.6} className={`${styles.deco} ${styles.solo} ${styles.gotaBlanca}`} />
          <Forma tipo="gota" colores={["yellow"]} duracion={4.4} className={`${styles.deco} ${styles.solo} ${styles.gotaAmarilla}`} />
          {/* debajo de las etiquetas, cierra la seccion */}
          <Forma tipo="brocha" colores={["white", "yellow"]} duracion={5} className={`${styles.deco} ${styles.solo} ${styles.brocha}`} />

          <div className={styles.retrato}>
            {/* arco: redondo arriba y con esquinas suaves abajo; sin foto queda el azul de fondo */}
            <div className={styles.arco}>
              {imagenSobreSara && (
                <img src={imagenSobreSara} alt="Retrato de Sara Figarra" className={styles.imagen} />
              )}
            </div>
            {/* una forma en cada esquina del arco: lapiz arriba a la izquierda, gota arriba a la derecha, flor abajo a la derecha y acuarela abajo a la izquierda */}
            <Forma tipo="lapiz" colores={["yellow"]} className={styles.lapiz} />
            <Forma tipo="gota" colores={["yellow-soft"]} duracion={3.2} className={styles.gotaArco} />
            <Forma tipo="flor" colores={["yellow", "rose"]} duracion={24} className={styles.flor} />
            <Forma tipo="acuarela" colores={["rose-soft"]} className={styles.acuarela} />
          </div>

          <div>
            <div className={styles.texto}>
              <p>
                Soy Sara Figarra, artista plástica, comunicadora social y
                muralista, y la creadora detrás de SAF Creaciones para Vos. Vivo
                en la costa argentina y mi trabajo es un reflejo de mi amor por
                el color y la forma.
              </p>
              <p>
                Cada creación es una pieza única con alma, hecha a mano con
                dedicación, calidez y una búsqueda constante de la belleza en
                los detalles.
              </p>
              <p className={styles.deseo}>
                Mi deseo es inspirar y conectar a las personas con la alegría de
                la creatividad.
              </p>
            </div>

            <h3 className={styles.subtitulo}>Trabajo con</h3>
            <ul className={styles.etiquetas}>
              {MATERIALES.map((material, indice) => (
                <li key={material} className={`${styles.etiqueta} ${ETIQUETAS[indice % ETIQUETAS.length]}`}>
                  {material}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SobreSara;
