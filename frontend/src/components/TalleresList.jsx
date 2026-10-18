import useFetch from "../hooks/useFetch";
import { ordenarTalleres } from "../utils/talleres";
import EncabezadoSeccion from "./EncabezadoSeccion";
import EstadoDeDatos from "./EstadoDeDatos";
import Silueta from "./Silueta";
import TallerCard from "./TallerCard";
import styles from "./TalleresList.module.css";

// seccion de talleres: sin filtro porque los talleres no tienen categoria
function TalleresList() {
  const { data: talleres, loading, error } = useFetch("/talleres");

  // mientras no llegan los datos talleres es null, por eso se usa un array vacio para no romper el ordenamiento
  const lista = ordenarTalleres(talleres ?? []);

  return (
    <section id="talleres" className={`container separador-botanico ${styles.seccion}`}>
      {/* piezas de herbario: la grande sangra por el borde junto al titular y las chicas asoman por los costados, donde queda lugar en blanco */}
      <Silueta tipo="alga" color="ocre" tamano="12rem" lado="derecha" dentro arriba="1rem" sangre="1rem" giro={4} profundidad={0.4} />
      <Silueta tipo="concha" color="tierra" tamano="8rem" lado="izquierda" arriba="42%" giro={-6} profundidad={-0.6} />
      <Silueta tipo="caracola" color="musgo" tamano="7rem" lado="derecha" arriba="72%" giro={8} profundidad={0.4} />
      <EncabezadoSeccion
        etiqueta="Talleres"
        silueta={{ tipo: "eucalipto", color: "salvia" }}
        titulo="Aprendé creando"
        descripcion="Talleres creativos para animarte a probar, con materiales y acompañamiento. No hace falta tener experiencia."
      />

      <EstadoDeDatos
        loading={loading}
        error={error}
        vacio={lista.length === 0}
        textoVacio="Por ahora no hay talleres programados. ¡Pronto vamos a sumar nuevos!"
      >
        <div className={styles.grilla}>
          {lista.map((taller) => (
            <TallerCard key={taller._id} taller={taller} />
          ))}
        </div>
      </EstadoDeDatos>
    </section>
  );
}

export default TalleresList;
