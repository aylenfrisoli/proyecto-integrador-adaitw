import { useState } from "react";
import useFetch from "../hooks/useFetch";
import { filtrarPorCategoria, obtenerCategorias } from "../utils/categorias";
import CategoriaFilter from "./CategoriaFilter";
import EncabezadoSeccion, { Acento, Linea } from "./EncabezadoSeccion";
import EstadoDeDatos from "./EstadoDeDatos";
import Forma from "./Forma";
import ProductoCard from "./ProductoCard";
import styles from "./ProductosList.module.css";

// seccion de productos: igual que la de obras, pide todo una vez y filtra por categoria en el front
function ProductosList() {
  const { data: productos, loading, error } = useFetch("/productos");
  // string vacio = "Todas"
  const [categoriaId, setCategoriaId] = useState("");

  // mientras no llegan los datos productos es null, por eso se usa un array vacio para no romper los calculos
  const lista = productos ?? [];
  const categorias = obtenerCategorias(lista);
  const productosVisibles = filtrarPorCategoria(lista, categoriaId);

  return (
    <section id="productos" className={styles.seccion}>
      {/* a la derecha del titular: un tubo que suelta pintura sobre una mancha de acuarela, con gotas que caen entre los dos */}
      <Forma tipo="acuarela" colores={["rose-soft"]} className={`${styles.deco} ${styles.acuarela}`} />
      <Forma tipo="pomo" colores={["yellow", "rose"]} className={`${styles.deco} ${styles.pomo}`} />
      <Forma tipo="gota" colores={["yellow"]} duracion={3.4} className={`${styles.deco} ${styles.gotaUno}`} />
      <Forma tipo="gota" colores={["rose-soft"]} duracion={4.2} className={`${styles.deco} ${styles.gotaDos}`} />

      {/* el resto se asoma por los costados y por detras de las tarjetas; en pantallas angostas se ocultan para que no tapen nada */}
      <Forma tipo="flor" colores={["rose-soft", "yellow"]} duracion={26} className={`${styles.deco} ${styles.solo} ${styles.flor}`} />
      <Forma tipo="lapiz" colores={["rose-soft"]} className={`${styles.deco} ${styles.solo} ${styles.lapiz}`} />
      <Forma tipo="brocha" colores={["wood", "sky"]} duracion={5} className={`${styles.deco} ${styles.solo} ${styles.brocha}`} />
      <Forma tipo="sol" colores={["yellow"]} className={`${styles.deco} ${styles.solo} ${styles.sol}`} />
      <Forma tipo="gota" colores={["lilac-soft"]} duracion={3.8} className={`${styles.deco} ${styles.solo} ${styles.gotaTres}`} />

      <div className="container">
        <EncabezadoSeccion
          titulo={
            <>
              <Linea>
                Hecho a mano
                <Forma tipo="pincel" colores={["yellow", "rose"]} duracion={4.5} ancho="0.62em" alto="0.62em" />
              </Linea>
              <Linea>
                <Acento>para vos</Acento>
                <Forma tipo="mariposa" colores={["yellow", "rose-soft"]} vuela ancho="0.55em" alto="0.55em" />
              </Linea>
            </>
          }
          descripcion="Cajas, bordados, bolsos y papelería artesanales. Consultá por WhatsApp y coordinamos la entrega."
        >
          {/* los filtros viven en la cabecera, por eso solo aparecen cuando ya llegaron los productos */}
          {lista.length > 0 && (
            <CategoriaFilter
              categorias={categorias}
              seleccionada={categoriaId}
              onSeleccionar={setCategoriaId}
            />
          )}
        </EncabezadoSeccion>

        <EstadoDeDatos
          loading={loading}
          error={error}
          vacio={lista.length === 0}
          textoVacio="Todavía no hay productos para mostrar."
        >
          <div className={styles.grilla}>
            {productosVisibles.map((producto) => (
              // el indice es la posicion en la lista completa, asi el color de la imagen no cambia al filtrar
              <ProductoCard key={producto._id} producto={producto} indice={lista.indexOf(producto)} />
            ))}
          </div>
        </EstadoDeDatos>
      </div>
    </section>
  );
}

export default ProductosList;
