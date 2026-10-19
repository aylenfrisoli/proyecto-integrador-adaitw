import useAccion from "../hooks/useAccion";
import useApi from "../hooks/useApi";
import useFetch from "../hooks/useFetch";
import estilos from "../styles/admin.module.css";
import EstadoDeDatos from "./EstadoDeDatos";
import MensajeAdmin from "./MensajeAdmin";
import PortadaForm from "./PortadaForm";

// panel web: cambia las fotos de la portada y de la seccion sobre sara
// la configuracion es un unico documento, por eso no hay lista: solo se lee y se guarda
function PortadaAdmin() {
  const { data, loading, error, recargar } = useFetch("/configuracion");
  const { pedir } = useApi();
  const { ejecutar, enviando, mensaje } = useAccion(recargar);

  // un texto vacio saca la foto; se mandan ambos campos para conservar la otra imagen
  async function guardar(campo, imagen) {
    const cuerpo = {
      imagenPortada: data?.imagenPortada ?? "",
      imagenSobreSara: data?.imagenSobreSara ?? "",
      [campo]: imagen,
    };
    await ejecutar(
      async () => {
        const respuesta = await pedir("/configuracion", { metodo: "PUT", cuerpo });
        if (respuesta?.[campo] !== imagen) {
          throw new Error("La API activa todavía no guarda esta imagen. Reiniciá o actualizá el backend y volvé a intentar.");
        }
      },
      imagen ? "Foto guardada." : "Foto quitada.",
    );
  }

  return (
    <section className={`container ${estilos.seccion}`}>
      <h2 className={`display-title ${estilos.titulo}`}>Web</h2>
      <p className={estilos.descripcion}>
        Configurá las imágenes que aparecen en la portada y en la sección «Cada
        pieza tiene su propia historia». Cada imagen puede pesar hasta 4 MB.
      </p>

      <MensajeAdmin mensaje={mensaje} />

      <EstadoDeDatos loading={loading} error={error} vacio={false}>
        {/* data es null solo mientras carga, y en ese caso EstadoDeDatos no muestra los children */}
        <PortadaForm
          campo="imagenPortada"
          titulo="Foto de la portada"
          descripcion="Se muestra al principio de la página, al lado del texto de bienvenida."
          imagenGuardada={data?.imagenPortada ?? ""}
          enviando={enviando}
          onGuardar={(imagen) => guardar("imagenPortada", imagen)}
        />
        <PortadaForm
          campo="imagenSobreSara"
          titulo="Foto de Sobre Sara"
          descripcion="Se muestra en la sección «Cada pieza tiene su propia historia»."
          imagenGuardada={data?.imagenSobreSara ?? ""}
          enviando={enviando}
          onGuardar={(imagen) => guardar("imagenSobreSara", imagen)}
        />
      </EstadoDeDatos>
    </section>
  );
}

export default PortadaAdmin;
