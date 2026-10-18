import { useState } from "react";
import useFetch from "../hooks/useFetch";
import { filtrarPorCategoria, obtenerCategorias } from "../utils/categorias";
import CategoriaFilter from "./CategoriaFilter";
import EncabezadoSeccion from "./EncabezadoSeccion";
import EstadoDeDatos from "./EstadoDeDatos";
import ProductoCard from "./ProductoCard";
import Silueta from "./Silueta";
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
      {/* siluetas naturales: la grande asoma junto al titular y las chicas por los costados, donde queda lugar en blanco */}
      <Silueta tipo="helecho" color="salvia" tamano="11rem" lado="derecha" dentro arriba="2rem" giro={-6} profundidad={0.5} />
      <Silueta tipo="abeja" color="ocre" tamano="4.5rem" lado="izquierda" arriba="22%" giro={-8} profundidad={-0.6} />
      <Silueta tipo="margarita" color="tierra" tamano="4rem" lado="derecha" arriba="58%" giro={10} profundidad={0.4} />
      <EncabezadoSeccion
        etiqueta="Productos"
        silueta={{ tipo: "semilla", color: "tierra" }}
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
