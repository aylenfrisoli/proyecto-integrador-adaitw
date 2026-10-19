import { Schema, model } from "mongoose";

// forma de la configuracion del sitio en typescript: datos sueltos de la landing que sara cambia desde el panel
export interface IConfiguracion {
  // data url de la foto de portada; vacio significa que todavia no hay foto
  imagenPortada: string;
  // data url del retrato de sara; vacio significa que todavia no hay foto
  imagenSobreSara: string;
}

// reglas que mongo aplica al guardar la configuracion
const configuracionSchema = new Schema<IConfiguracion>(
  {
    imagenPortada: {
      type: String,
      trim: true,
      // sin required: el sitio funciona sin foto, la landing muestra un bloque de color en su lugar
      default: "",
    },
    imagenSobreSara: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    // agrega createdAt y updatedAt solos, sin tener que manejarlos a mano
    timestamps: true,
  }
);

// a diferencia de las otras entidades, esta coleccion tiene un unico documento: no hay lista, no hay ids en las rutas
// el nombre de la coleccion se fija a mano porque mongoose pluraliza en ingles y quedaria "configuracions"
export const Configuracion = model<IConfiguracion>(
  "Configuracion",
  configuracionSchema,
  "configuraciones"
);
