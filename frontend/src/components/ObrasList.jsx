import { useState } from "react";
import useFetch from "../hooks/useFetch";
import { filtrarPorCategoria, obtenerCategorias } from "../utils/categorias";
import CategoriaFilter from "./CategoriaFilter";
import EncabezadoSeccion from "./EncabezadoSeccion";
import EstadoDeDatos from "./EstadoDeDatos";
import ObraCard from "./ObraCard";
import Silueta from "./Silueta";
import styles from "./ObrasList.module.css";

// seccion de obras: pide todas a la api una sola vez y filtra por categoria en el front
function ObrasList() {
  const { data: obras, loading, error } = useFetch("/obras");
  // string vacio = "Todas"; se guarda el id y no el nombre porque el id no se repite
  const [categoriaId, setCategoriaId] = useState("");

  // mientras no llegan los datos obras es null, por eso se usa un array vacio para no romper los calculos
  const lista = obras ?? [];
  const categorias = obtenerCategorias(lista);
  const obrasVisibles = filtrarPorCategoria(lista, categoriaId);

  return (
    <section id="obras" className={`container ${styles.seccion}`}>
      {/* siluetas naturales: la grande asoma junto al titular y las chicas por los costados, donde queda lugar en blanco */}
      <Silueta tipo="rama" color="musgo" tamano="11rem" lado="derecha" dentro arriba="2.5rem" giro={8} profundidad={0.5} />
      <Silueta tipo="mariposa" color="ocre" tamano="4rem" lado="izquierda" arriba="30%" giro={-10} profundidad={-0.6} />
      <Silueta tipo="flor" color="ladrillo" tamano="3.5rem" lado="derecha" arriba="62%" giro={12} profundidad={0.4} />
      <EncabezadoSeccion
        etiqueta="Obras"
        silueta={{ tipo: "hoja", color: "salvia" }}
        titulo="Una obra, una historia"
        descripcion="Pinturas, collages y bordados únicos, hechos a mano con mucho color."
      />

      <EstadoDeDatos
        loading={loading}
        error={error}
        vacio={lista.length === 0}
        textoVacio="Todavía no hay obras para mostrar."
      >
        <CategoriaFilter
          categorias={categorias}
          seleccionada={categoriaId}
          onSeleccionar={setCategoriaId}
        />

        <div className={styles.grilla}>
          {obrasVisibles.map((obra) => (
            <ObraCard key={obra._id} obra={obra} />
          ))}
        </div>
      </EstadoDeDatos>
    </section>
  );
}

export default ObrasList;
