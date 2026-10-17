import useFetch from "../hooks/useFetch";
import { ordenarTalleres } from "../utils/talleres";
import EncabezadoSeccion from "./EncabezadoSeccion";
import EstadoDeDatos from "./EstadoDeDatos";
import FormaDecorativa from "./FormaDecorativa";
import TallerCard from "./TallerCard";
import styles from "./TalleresList.module.css";

// seccion de talleres: sin filtro porque los talleres no tienen categoria
function TalleresList() {
  const { data: talleres, loading, error } = useFetch("/talleres");

  // mientras no llegan los datos talleres es null, por eso se usa un array vacio para no romper el ordenamiento
  const lista = ordenarTalleres(talleres ?? []);

  return (
    <section id="talleres" className={`container ${styles.seccion}`}>
      {/* formas que asoman por los costados, donde queda lugar en blanco */}
      <FormaDecorativa tipo="ovalo" color="azul" tamano="5.5rem" lado="izquierda" arriba="42%" />
      <FormaDecorativa tipo="arco" color="lila" tamano="4rem" lado="derecha" arriba="18%" />
      <FormaDecorativa tipo="cuarto" color="rosa" tamano="3.5rem" lado="derecha" arriba="72%" />
      <EncabezadoSeccion
        etiqueta="Talleres"
        forma={{ tipo: "cuarto", color: "melocoton" }}
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
