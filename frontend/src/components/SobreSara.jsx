import FormaDecorativa from "./FormaDecorativa";
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

// clases pastel que se reparten entre las etiquetas, una por una y volviendo a empezar
const COLORES = [styles.rosa, styles.lila, styles.azul, styles.melocoton];

// presentacion de sara: dos columnas, el titulo a la izquierda y el texto con las etiquetas a la derecha
function SobreSara() {
  return (
    <section id="sobre-sara" className={`container ${styles.seccion}`}>
      {/* formas que asoman por los costados, donde queda lugar en blanco */}
      <FormaDecorativa tipo="gota" color="melocoton" tamano="4.5rem" lado="izquierda" arriba="72%" />
      <FormaDecorativa tipo="cuarto" color="azul" tamano="4rem" lado="derecha" arriba="10%" />
      <FormaDecorativa tipo="ovalo" color="rosa" tamano="5rem" lado="derecha" arriba="78%" />
      <div>
        <p className={styles.eyebrow}>Sobre Sara</p>
        <h2 className={`display-title ${styles.titulo}`}>
          Cada pieza tiene su propia historia
        </h2>
        {/* dos formas de distinto tamaño, como un pequeño collage bajo el titular */}
        <div className={styles.formas}>
          <FormaDecorativa tipo="ovalo" color="lila" tamano="4.5rem" />
          <FormaDecorativa tipo="gota" color="rosa" tamano="3rem" />
        </div>
      </div>

      <div className={styles.contenido}>
        <p>
          Soy Sara, la artista y creadora detrás de SAF Creaciones para Vos, y
          vivo en la costa argentina. Mi trabajo es un reflejo de mi amor por
          el color y la forma.
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
