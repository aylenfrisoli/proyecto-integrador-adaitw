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
    <section id="talleres" className={`container ${styles.seccion}`}>
      {/* siluetas naturales: la grande asoma junto al titular y las chicas por los costados, donde queda lugar en blanco */}
      <Silueta tipo="montanas" color="tierra" tamano="10rem" lado="derecha" dentro arriba="3rem" profundidad={0.4} />
      <Silueta tipo="pajaro" color="musgo" tamano="4.5rem" lado="izquierda" arriba="42%" giro={-6} profundidad={-0.6} />
      <Silueta tipo="hongo" color="ladrillo" tamano="3.5rem" lado="derecha" arriba="72%" giro={6} profundidad={0.4} />
      <EncabezadoSeccion
        etiqueta="Talleres"
        silueta={{ tipo: "hoja", color: "ocre" }}
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
