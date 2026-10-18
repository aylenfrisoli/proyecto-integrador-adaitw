import useAccion from "../hooks/useAccion";
import useApi from "../hooks/useApi";
import useFetch from "../hooks/useFetch";
import estilos from "../styles/admin.module.css";
import EstadoDeDatos from "./EstadoDeDatos";
import MensajeAdmin from "./MensajeAdmin";
import PortadaForm from "./PortadaForm";

// panel de la portada: cambia la foto grande del principio de la landing
// la configuracion es un unico documento, por eso no hay lista: solo se lee y se guarda
function PortadaAdmin() {
  const { data, loading, error, recargar } = useFetch("/configuracion");
  const { pedir } = useApi();
  const { ejecutar, enviando, mensaje } = useAccion(recargar);

  // un texto vacio saca la foto; la api lo acepta como "sin foto"
  async function guardar(imagenPortada) {
    await ejecutar(
      () => pedir("/configuracion", { metodo: "PUT", cuerpo: { imagenPortada } }),
      imagenPortada ? "Foto de la portada guardada." : "Foto de la portada quitada.",
    );
  }

  return (
    <section className={`container ${estilos.seccion}`}>
      <h2 className={`display-title ${estilos.titulo}`}>Portada</h2>
      <p className={estilos.descripcion}>
        Es la foto grande que se ve al principio de la página, al lado del texto
        de bienvenida. Pegá el link directo a la imagen, igual que en las obras;
        se muestra en formato horizontal.
      </p>

      <MensajeAdmin mensaje={mensaje} />

      <EstadoDeDatos loading={loading} error={error} vacio={false}>
        {/* data es null solo mientras carga, y en ese caso EstadoDeDatos no muestra los children */}
        <PortadaForm
          imagenGuardada={data?.imagenPortada ?? ""}
          enviando={enviando}
          onGuardar={guardar}
        />
      </EstadoDeDatos>
    </section>
  );
}

export default PortadaAdmin;
