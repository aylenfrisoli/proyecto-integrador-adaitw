import { Schema, model } from "mongoose";

// forma de la configuracion del sitio en typescript: datos sueltos de la landing que sara cambia desde el panel
export interface IConfiguracion {
  // link directo a la foto de la portada; vacio significa que todavia no hay foto
  imagenPortada: string;
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
