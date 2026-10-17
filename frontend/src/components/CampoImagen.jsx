import { useState } from "react";
import estilos from "../styles/admin.module.css";

// campo para pegar el link de una imagen, con vista previa y un aviso si el link no carga
// cuadrada cambia la proporcion de la vista previa: 4/5 para obras y 1/1 para productos
function CampoImagen({ valor, onChange, cuadrada = false }) {
  const [falla, setFalla] = useState(false);

  function cambiar(evento) {
    onChange(evento.target.value);
    // se vuelve a intentar mostrar la vista previa cada vez que cambia el link
    setFalla(false);
  }

  return (
    <>
      <label className={estilos.campo}>
        Imagen (link)
        <input
          type="url"
          value={valor}
          onChange={cambiar}
          placeholder="https://..."
          required
        />
      </label>

      {/* vista previa: ayuda a detectar un link roto antes de guardar */}
      {valor.trim() && !falla && (
        <img
          src={valor}
          alt="Vista previa de la imagen"
          className={`${estilos.vistaPrevia} ${cuadrada ? estilos.vistaPreviaCuadrada : ""}`}
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
