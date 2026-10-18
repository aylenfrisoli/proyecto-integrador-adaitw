import Silueta from "./Silueta";
import styles from "./SobreSara.module.css";

// materiales con los que trabaja sara, salen de las categorias del sitio
const MATERIALES = [
  "Pinturas",
  "Cajas",
  "Bordados",
  "Bolsos",
  "Papelería",
  "Collages",
];

// clases de color que se reparten entre las etiquetas, una por una y volviendo a empezar
const COLORES = [styles.ladrillo, styles.arena, styles.salvia, styles.ocre];

// presentacion de sara: dos columnas, el titulo a la izquierda y el texto con las etiquetas a la derecha
function SobreSara() {
  return (
    <section id="sobre-sara" className={`container separador-botanico ${styles.seccion}`}>
      {/* piezas de herbario que asoman por los costados, donde queda lugar en blanco */}
      <Silueta tipo="amapola" color="ladrillo" tamano="7rem" lado="izquierda" arriba="72%" giro={-6} profundidad={-0.6} />
      <Silueta tipo="diente" color="salvia" tamano="7rem" lado="derecha" arriba="10%" giro={4} profundidad={0.4} />
      <Silueta tipo="espiga" color="tierra" tamano="5rem" lado="derecha" arriba="78%" giro={6} profundidad={-0.4} />
      <div>
        <p className={styles.eyebrow}>Sobre Sara</p>
        <h2 className={`display-title ${styles.titulo}`}>
          Cada pieza tiene su propia historia
        </h2>
        {/* una pluma, una concha y una caracola, como los objetos que quedan sobre la mesa de un taller de la costa */}
        <div className={styles.siluetas}>
          <Silueta tipo="pluma" color="tierra" tamano="4rem" giro={-4} />
          <Silueta tipo="concha" color="tierra" tamano="8rem" />
          <Silueta tipo="caracola" color="musgo" tamano="6.5rem" />
        </div>
      </div>

      <div className={styles.contenido}>
        <p>
          Soy Sara Figarra, artista plástica, comunicadora social y muralista,
          y la creadora detrás de SAF Creaciones para Vos. Vivo en la costa
          argentina y mi trabajo es un reflejo de mi amor por el color y la
          forma.
        </p>
        <p>
          Cada creación es una pieza única con alma, hecha a mano con
          dedicación, calidez y una búsqueda constante de la belleza en los
          detalles.
        </p>
        <p>
          Mi deseo es inspirar y conectar a las personas con la alegría de la
          creatividad.
        </p>

        <h3 className={styles.subtitulo}>Trabajo con</h3>
        <ul className={styles.etiquetas}>
          {MATERIALES.map((material, indice) => (
            <li
              key={material}
              className={`${styles.etiqueta} ${COLORES[indice % COLORES.length]}`}
            >
              {material}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default SobreSara;
