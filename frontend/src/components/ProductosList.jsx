import { useState } from "react";
import useFetch from "../hooks/useFetch";
import { filtrarPorCategoria, obtenerCategorias } from "../utils/categorias";
import CategoriaFilter from "./CategoriaFilter";
import EncabezadoSeccion from "./EncabezadoSeccion";
import EstadoDeDatos from "./EstadoDeDatos";
import FormaDecorativa from "./FormaDecorativa";
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
    <section id="productos" className={`container ${styles.seccion}`}>
      {/* formas que asoman por los costados, donde queda lugar en blanco */}
      <FormaDecorativa tipo="gota" color="ladrillo" tamano="5rem" lado="derecha" arriba="22%" />
      <FormaDecorativa tipo="arco" color="salvia" tamano="4rem" lado="izquierda" arriba="60%" />
      <EncabezadoSeccion
        etiqueta="Productos"
        forma={{ tipo: "arco", color: "salvia" }}
        titulo="Hecho a mano para vos"
        descripcion="Cajas, bordados, bolsos y papelería artesanales. Consultá por WhatsApp y coordinamos la entrega."
      />

      <EstadoDeDatos
        loading={loading}
        error={error}
        vacio={lista.length === 0}
        textoVacio="Todavía no hay productos para mostrar."
      >
        <CategoriaFilter
          categorias={categorias}
          seleccionada={categoriaId}
          onSeleccionar={setCategoriaId}
        />

        <div className={styles.grilla}>
          {productosVisibles.map((producto) => (
            <ProductoCard key={producto._id} producto={producto} />
          ))}
        </div>
      </EstadoDeDatos>
    </section>
  );
}

export default ProductosList;
