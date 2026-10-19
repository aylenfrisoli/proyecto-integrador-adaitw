import { useState } from "react";
import estilos from "../styles/admin.module.css";
import { fileToBase64 } from "../utils/fileToBase64";

const TAMANO_MAXIMO_IMAGEN = 4 * 1024 * 1024;

// cuadrada y horizontal cambian la proporcion de la vista previa: 4/5 para obras, 1/1 para productos y 16/10 para la portada
// etiqueta y chica son para cuando hay varias imagenes en el mismo formulario (las fotos de la caminata)
// obligatorio false deja guardar el campo vacio (la portada puede no tener foto)
function CampoImagen({
  valor,
  onChange,
  cuadrada = false,
  horizontal = false,
  etiqueta = "Imagen",
  chica = false,
  obligatorio = true,
}) {
  const [error, setError] = useState("");
  const [leyendo, setLeyendo] = useState(false);

  async function cambiarArchivo(evento) {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      setError("Elegí un archivo de imagen.");
      evento.target.value = "";
      return;
    }

    if (archivo.size > TAMANO_MAXIMO_IMAGEN) {
      setError("La imagen no puede superar los 4 MB.");
      evento.target.value = "";
      return;
    }

    setError("");
    setLeyendo(true);
    try {
      onChange(await fileToBase64(archivo));
    } catch {
      setError("No se pudo leer la imagen. Probá con otro archivo.");
    } finally {
      setLeyendo(false);
      evento.target.value = "";
    }
  }

  return (
    <>
      <label className={estilos.campo}>
        {etiqueta}
        <input
          type="file"
          accept="image/*"
          onChange={cambiarArchivo}
          required={obligatorio && !valor.startsWith("data:image/")}
          disabled={leyendo}
        />
      </label>

      {leyendo && <p className={estilos.pista}>Preparando la imagen...</p>}
      {error && <p className={estilos.errorImagen} role="alert">{error}</p>}
      {valor && (
        <img
          src={valor}
          alt="Vista previa de la imagen"
          className={`${estilos.vistaPrevia} ${cuadrada ? estilos.vistaPreviaCuadrada : ""} ${horizontal ? estilos.vistaPreviaHorizontal : ""} ${chica ? estilos.vistaPreviaChica : ""}`}
        />
      )}
    </>
  );
}

export default CampoImagen;
