import { useState } from "react";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import useFetch from "../hooks/useFetch";
import { elegirEdicion, formatearDia, ordenarEdiciones } from "../utils/caminata";
import ApoyoCaminata from "./ApoyoCaminata";
import styles from "./Caminata.module.css";
import EncabezadoSeccion from "./EncabezadoSeccion";
import EstadoDeDatos from "./EstadoDeDatos";
import PolaroidCard from "./PolaroidCard";
import SelectorEdicion from "./SelectorEdicion";
import Silueta from "./Silueta";

// seccion de la caminata: un boton por edicion y debajo los datos y las polaroids de la elegida
function Caminata() {
  const { data, loading, error } = useFetch("/caminatas");
  // null = todavia no eligio ninguna, se muestra la edicion mas reciente
  const [elegidaId, setElegidaId] = useState(null);

  // mientras no llegan los datos es null, por eso un array vacio para no romper el ordenamiento
  const ediciones = ordenarEdiciones(data ?? []);
  const edicion = elegirEdicion(ediciones, elegidaId);

  return (
    <section id="caminata" className={`container ${styles.seccion}`}>
      {/* siluetas naturales: la grande asoma junto al titular y las chicas por los costados, donde queda lugar en blanco */}
      {/* mas abajo que en las otras secciones: el titular de la caminata es largo y llega casi hasta el borde derecho, asi que la margarita se apoya junto a la bajada */}
      <Silueta tipo="margarita" color="ocre" tamano="8rem" lado="derecha" dentro arriba="17rem" giro={8} profundidad={0.5} />
      <Silueta tipo="mariposa" color="musgo" tamano="4rem" lado="derecha" arriba="14%" giro={10} profundidad={-0.6} />
      <Silueta tipo="piedras" color="tierra" tamano="4rem" lado="izquierda" arriba="62%" profundidad={0.4} />
      <EncabezadoSeccion
        etiqueta="Concientización"
        silueta={{ tipo: "flor", color: "ladrillo" }}
        titulo="Caminata sobre el cáncer de mama"
        descripcion="Una jornada para caminar en comunidad, visibilizar el cáncer de mama y acompañarnos entre todos. La organiza Sara: elegí una edición y mirá cómo fue."
      />

      <EstadoDeDatos
        loading={loading}
        error={error}
        vacio={ediciones.length === 0}
        textoVacio="Pronto vas a poder ver acá cómo fueron las ediciones de la caminata."
      >
        {/* edicion puede ser undefined solo mientras no hay datos, y en ese caso EstadoDeDatos no muestra los children */}
        <SelectorEdicion
          ediciones={ediciones}
          elegidaId={edicion?._id}
          onElegir={setElegidaId}
        />

        {edicion && (
          // la key hace que al cambiar de edicion el panel se cree de nuevo y repita su animacion de entrada
          <div key={edicion._id} className={styles.detalle}>
            <div className={styles.cabeza}>
              <h3 className={styles.nombre}>{edicion.nombre}</h3>
              <ul className={styles.datos}>
                <li>
                  <FiCalendar aria-hidden="true" />
                  {formatearDia(edicion.fecha)}
                </li>
                <li>
                  <FiMapPin aria-hidden="true" />
                  {edicion.lugar}
                </li>
              </ul>
            </div>

            <p className={styles.descripcion}>{edicion.descripcion}</p>

            {edicion.fotos.length > 0 ? (
              <div className={styles.grilla}>
                {edicion.fotos.map((foto, indice) => (
                  // las fotos no tienen id propio y la lista no se reordena, asi que el indice sirve de key
                  <PolaroidCard
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
    </section>
  );
}

export default Caminata;
