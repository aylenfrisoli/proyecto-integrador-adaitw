import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { elegirEdicion, formatearDia, ordenarEdiciones } from "../../utils/caminata";
import EncabezadoSeccion, { Acento, Linea } from "../../components/EncabezadoSeccion";
import EstadoDeDatos from "../../components/EstadoDeDatos";
import Forma from "../../components/Forma";
import ApoyoCaminata from "./ApoyoCaminata";
import styles from "./Caminata.module.css";
import FotoCaminata from "./FotoCaminata";
import SelectorEdicion from "./SelectorEdicion";

// seccion de la caminata: un boton por edicion y debajo los datos y las fotos de la elegida
function Caminata() {
  const { data, loading, error } = useFetch("/caminatas");
  // null = todavia no eligio ninguna, se muestra la edicion mas reciente
  const [elegidaId, setElegidaId] = useState(null);

  // mientras no llegan los datos es null, por eso un array vacio para no romper el ordenamiento
  const ediciones = ordenarEdiciones(data ?? []);
  const edicion = elegirEdicion(ediciones, elegidaId);

  return (
    <section id="caminata" className={styles.seccion}>
      <Forma tipo="mariposa" colores={["rose", "rose-soft"]} duracion={0.7} vuela className={styles.mariposaArriba} />
      <Forma tipo="mariposa" colores={["rose-soft", "cream"]} duracion={1.1} vuela className={styles.mariposaCostado} />

      <div className="container">
        <EncabezadoSeccion
          titulo={
            <>
              <Linea>
                Caminata
                <Forma tipo="flor" colores={["rose", "yellow"]} duracion={20} ancho="0.62em" alto="0.62em" />
              </Linea>
              <Linea>
                sobre el
                <Forma tipo="mariposa" colores={["rose-soft", "rose"]} duracion={0.9} ancho="0.78em" alto="0.62em" />
              </Linea>
              <Acento>cáncer de mama</Acento>
            </>
          }
          descripcion="Una jornada para caminar en comunidad, visibilizar el cáncer de mama y acompañarnos entre todos. La organiza Sara: elegí una edición y mirá cómo fue."
        >
          {/* los botones viven en la cabecera, por eso solo aparecen cuando ya llegaron las ediciones */}
          {ediciones.length > 0 && (
            <SelectorEdicion
              ediciones={ediciones}
              elegidaId={edicion?._id}
              onElegir={setElegidaId}
            />
          )}
        </EncabezadoSeccion>

        <EstadoDeDatos
          loading={loading}
          error={error}
          vacio={ediciones.length === 0}
          textoVacio="Pronto vas a poder ver acá cómo fueron las ediciones de la caminata."
        >
          {/* edicion puede ser undefined solo mientras no hay datos, y en ese caso EstadoDeDatos no muestra los children */}
          {edicion && (
            // la key hace que al cambiar de edicion el panel se cree de nuevo y repita su animacion de entrada
            <div key={edicion._id} className={styles.detalle}>
              <div className={styles.cabeza}>
                <div>
                  <h3 className={styles.nombre}>{edicion.nombre}</h3>
                  <p className={styles.datos}>
                    {formatearDia(edicion.fecha)} · {edicion.lugar}
                  </p>
                </div>
                <p className={styles.descripcion}>{edicion.descripcion}</p>
              </div>

              {edicion.fotos.length > 0 ? (
                <div className={styles.grilla}>
                  {edicion.fotos.map((foto, indice) => (
                    // las fotos no tienen id propio y la lista no se reordena, asi que el indice sirve de key
                    <FotoCaminata
                      key={indice}
                      foto={foto}
                      indice={indice}
                      descripcion={`Foto ${indice + 1}, ${edicion.nombre}`}
                    />
                  ))}
                </div>
              ) : (
                <p className={styles.sinFotos}>
                  Pronto vamos a subir las fotos de esta edición.
                </p>
              )}
            </div>
          )}
        </EstadoDeDatos>

        {/* va afuera de EstadoDeDatos para que se vea siempre, aunque las ediciones no hayan cargado */}
        <ApoyoCaminata />
      </div>
    </section>
  );
}

export default Caminata;
