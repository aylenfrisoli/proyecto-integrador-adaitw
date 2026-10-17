import useFetch from "../hooks/useFetch";
import { ordenarTalleres } from "../utils/talleres";
import EncabezadoSeccion from "./EncabezadoSeccion";
import EstadoDeDatos from "./EstadoDeDatos";
import TallerCard from "./TallerCard";
import styles from "./TalleresList.module.css";

// seccion de talleres: sin filtro porque los talleres no tienen categoria
function TalleresList() {
  const { data: talleres, loading, error } = useFetch("/talleres");

  // mientras no llegan los datos talleres es null, por eso se usa un array vacio para no romper el ordenamiento
  const lista = ordenarTalleres(talleres ?? []);

  return (
    <section id="talleres" className={`container ${styles.seccion}`}>
      <EncabezadoSeccion
        etiqueta="Talleres"
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
