import { useState } from "react";
import estilos from "../styles/admin.module.css";

// campo para pegar el link de una imagen, con vista previa y un aviso si el link no carga
// cuadrada y horizontal cambian la proporcion de la vista previa: 4/5 para obras, 1/1 para productos y 16/10 para la portada
// etiqueta y chica son para cuando hay varias imagenes en el mismo formulario (las fotos de la caminata)
// obligatorio false deja guardar el campo vacio (la portada puede no tener foto)
function CampoImagen({
  valor,
  onChange,
  cuadrada = false,
  horizontal = false,
  etiqueta = "Imagen (link)",
  chica = false,
  obligatorio = true,
}) {
  const [falla, setFalla] = useState(false);

  function cambiar(evento) {
    onChange(evento.target.value);
    // se vuelve a intentar mostrar la vista previa cada vez que cambia el link
    setFalla(false);
  }

  return (
    <>
      <label className={estilos.campo}>
        {etiqueta}
        <input
          type="url"
          value={valor}
          onChange={cambiar}
          placeholder="https://..."
          required={obligatorio}
        />
      </label>

      {/* vista previa: ayuda a detectar un link roto antes de guardar */}
      {valor.trim() && !falla && (
        <img
          src={valor}
          alt="Vista previa de la imagen"
          className={`${estilos.vistaPrevia} ${cuadrada ? estilos.vistaPreviaCuadrada : ""} ${horizontal ? estilos.vistaPreviaHorizontal : ""} ${chica ? estilos.vistaPreviaChica : ""}`}
          onError={() => setFalla(true)}
        />
      )}
      {valor.trim() && falla && (
        <p className={estilos.pista}>
          No pudimos cargar la imagen. Revisá que el link sea correcto y que la
          imagen sea pública.
        </p>
      )}
    </>
  );
}

export default CampoImagen;
