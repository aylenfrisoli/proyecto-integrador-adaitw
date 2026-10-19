import useFetch from "../hooks/useFetch";
import { ordenarTalleres } from "../utils/talleres";
import Bandas from "./Bandas";
import EncabezadoSeccion, { Acento, Linea } from "./EncabezadoSeccion";
import EstadoDeDatos from "./EstadoDeDatos";
import Forma from "./Forma";
import TallerFila from "./TallerFila";
import styles from "./TalleresList.module.css";

// seccion de talleres: sin filtro porque los talleres no tienen categoria
function TalleresList() {
  const { data: talleres, loading, error } = useFetch("/talleres");

  // mientras no llegan los datos talleres es null, por eso se usa un array vacio para no romper el ordenamiento
  const lista = ordenarTalleres(talleres ?? []);

  return (
    <section id="talleres" className={styles.seccion}>
      <Bandas color="plum" className={styles.bandas} />

      <div className="container">
        <EncabezadoSeccion
          titulo={
            <>
              <Linea>
                Aprendé
                <Forma
                  tipo="paleta"
                  colores={["wood", "rose", "sky", "plum", "olive", "yellow"]}
                  ancho="0.6em"
                  alto="0.6em"
                />
              </Linea>
              <Linea>
                <Forma tipo="flor" colores={["lilac", "white"]} duracion={26} ancho="0.6em" alto="0.6em" />
                <Acento>creando</Acento>
              </Linea>
            </>
          }
          descripcion="Talleres creativos para animarte a probar, con materiales y acompañamiento. No hace falta tener experiencia."
        />

        {/* las formas se miden desde el borde de arriba de esta zona (la linea de la lista), asi quedan siempre apoyadas en ella */}
        <div className={styles.zonaLista}>
          <Forma tipo="lapiz" colores={["sky"]} className={`${styles.deco} ${styles.lapiz}`} />
          <Forma tipo="brocha" colores={["rose", "sky"]} duracion={5.5} className={`${styles.deco} ${styles.brocha}`} />
          <Forma tipo="gota" colores={["rose"]} duracion={3.4} className={`${styles.deco} ${styles.gotaUno}`} />
          <Forma tipo="gota" colores={["lilac"]} duracion={4.4} className={`${styles.deco} ${styles.solo} ${styles.gotaDos}`} />
          <Forma tipo="mariposa" colores={["rose", "yellow"]} vuela className={`${styles.deco} ${styles.solo} ${styles.mariposa}`} />

          <EstadoDeDatos
            loading={loading}
            error={error}
            vacio={lista.length === 0}
            textoVacio="Por ahora no hay talleres programados. ¡Pronto vamos a sumar nuevos!"
          >
            {/* lista ordenada porque el orden importa: primero los talleres que vienen y al final los ya realizados */}
            <ol className={styles.lista}>
              {lista.map((taller) => (
                <TallerFila key={taller._id} taller={taller} />
              ))}
            </ol>
          </EstadoDeDatos>
        </div>
      </div>
    </section>
  );
}

export default TalleresList;
