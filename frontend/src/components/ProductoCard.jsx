import { armarLinkWhatsapp } from "../config/contacto";
import {
  armarMensajeProducto,
  ETIQUETAS_DISPONIBILIDAD,
  formatearPrecio,
} from "../utils/productos";
import styles from "./ProductoCard.module.css";

// colores de fondo de la imagen mientras carga (o si falla), se reparten uno por uno y volviendo a empezar
const FONDOS = [styles.fondoLila, styles.fondoAmarillo, styles.fondoNeblina];

// tarjeta de un producto: imagen cuadrada con etiqueta de disponibilidad, precio y boton para consultar por whatsapp
// indice es la posicion del producto en la lista completa y solo sirve para elegir el color de fondo de la imagen
function ProductoCard({ producto, indice }) {
  const agotado = producto.disponibilidad === "agotado";

  return (
    <article className={styles.tarjeta}>
      <div className={`${styles.contenedorImagen} ${FONDOS[indice % FONDOS.length]}`}>
        <img
          src={producto.imagen}
          alt={producto.titulo}
          // un producto agotado se ve apagado y sin color para que se note de un vistazo
          className={`${styles.imagen} ${agotado ? styles.apagada : ""}`}
          loading="lazy"
        />
        {/* la clase sale del valor de la api (disponible, agotado, por_encargo), asi cada uno tiene su color */}
        <span className={`${styles.etiqueta} ${styles[producto.disponibilidad]}`}>
          {ETIQUETAS_DISPONIBILIDAD[producto.disponibilidad]}
        </span>
      </div>

      <div className={styles.info}>
        <p className={styles.categoria}>{producto.categoria.nombre}</p>
        <h3 className={styles.titulo}>{producto.titulo}</h3>
        <p className={styles.descripcion}>{producto.descripcion}</p>

        <div className={styles.pie}>
          <p className={styles.precio}>{formatearPrecio(producto.precio)}</p>
          {/* se abre en otra pestaña; noopener evita que la pagina nueva pueda controlar esta */}
          <a
            href={armarLinkWhatsapp(armarMensajeProducto(producto))}
            className={styles.boton}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Consultar por ${producto.titulo} por WhatsApp`}
          >
            Consultar
          </a>
        </div>
      </div>
    </article>
  );
}

export default ProductoCard;
