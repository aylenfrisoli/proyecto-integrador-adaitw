import { Schema, Types, model } from "mongoose";

// forma de una obra de sara en typescript
export interface IObra {
  titulo: string;
  descripcion: string;
  imagen: string;
  // guarda el id de la categoria y no la categoria entera, asi si cambia el nombre no hay que tocar cada obra
  categoria: Types.ObjectId;
}

// reglas que mongo aplica al guardar una obra
const obraSchema = new Schema<IObra>(
  {
    titulo: {
      type: String,
      required: [true, "el titulo es obligatorio"],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, "la descripcion es obligatoria"],
      trim: true,
    },
    imagen: {
      type: String,
      // solo guardamos la url, la imagen vive en otro servicio (no subimos archivos)
      required: [true, "la imagen es obligatoria"],
      trim: true,
    },
    categoria: {
      type: Schema.Types.ObjectId,
      // ref le dice a mongoose a que modelo apunta el id, asi populate puede traer la categoria completa
      ref: "Categoria",
      required: [true, "la categoria es obligatoria"],
    },
  },
  {
    // agrega createdAt y updatedAt solos, sin tener que manejarlos a mano
    timestamps: true,
  }
);

// el modelo que usamos para el crud de obras, mongo lo guarda en la coleccion "obras"
export const Obra = model<IObra>("Obra", obraSchema);
