import { useState } from "react";
import useFetch from "../hooks/useFetch";
import { filtrarPorCategoria, obtenerCategorias } from "../utils/categorias";
import CategoriaFilter from "./CategoriaFilter";
import EncabezadoSeccion, { Acento, Linea } from "./EncabezadoSeccion";
import EstadoDeDatos from "./EstadoDeDatos";
import Forma from "./Forma";
import ObraCard from "./ObraCard";
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
    <section id="obras" className={styles.seccion}>
      <div className="container">
        <EncabezadoSeccion
          titulo={
            <>
              <Linea>
                Una obra,
                <Forma
                  tipo="paleta"
                  colores={["white", "rose", "sky", "plum", "olive", "rose-soft"]}
                  ancho="0.6em"
                  alto="0.6em"
                />
              </Linea>
              <Acento>una historia</Acento>
            </>
          }
          descripcion="Pinturas, collages y bordados únicos, hechos a mano con mucho color."
        >
          {/* los filtros viven en la cabecera, por eso solo aparecen cuando ya llegaron las obras */}
          {lista.length > 0 && (
            <CategoriaFilter
              categorias={categorias}
              seleccionada={categoriaId}
              onSeleccionar={setCategoriaId}
            />
          )}
        </EncabezadoSeccion>

        {/* las formas se miden desde el borde de arriba y de abajo de esta zona (la grilla de obras), asi quedan siempre pegadas a las tarjetas */}
        <div className={styles.zonaGrilla}>
          {/* paradas sobre las tarjetas de arriba, a la derecha, donde no hay titular ni filtros */}
          <Forma tipo="lapiz" colores={["plum"]} className={`${styles.deco} ${styles.lapiz}`} />
          <Forma tipo="brocha" colores={["plum", "rose"]} duracion={5} className={`${styles.deco} ${styles.brocha}`} />
          <Forma tipo="gota" colores={["sky"]} duracion={3.6} className={`${styles.deco} ${styles.gotaUno}`} />
          <Forma tipo="gota" colores={["rose"]} duracion={4.4} className={`${styles.deco} ${styles.solo} ${styles.gotaDos}`} />
          <Forma tipo="mariposa" colores={["rose", "plum"]} vuela className={`${styles.deco} ${styles.solo} ${styles.mariposa}`} />
          {/* estas dos se asoman por detras de las tarjetas */}
          <Forma tipo="acuarela" colores={["sky"]} className={`${styles.deco} ${styles.solo} ${styles.detras} ${styles.acuarela}`} />
          <Forma tipo="flor" colores={["white", "rose"]} duracion={28} className={`${styles.deco} ${styles.solo} ${styles.detras} ${styles.flor}`} />

          <EstadoDeDatos
            loading={loading}
            error={error}
            vacio={lista.length === 0}
            textoVacio="Todavía no hay obras para mostrar."
          >
            <div className={styles.grilla}>
              {obrasVisibles.map((obra) => (
                <ObraCard key={obra._id} obra={obra} />
              ))}
            </div>
          </EstadoDeDatos>
        </div>
      </div>
    </section>
  );
}

export default ObrasList;
