import { Schema, model } from "mongoose";

// forma de una categoria en typescript (ej: pinturas, ceramica, laminas)
export interface ICategoria {
  nombre: string;
}

// reglas que mongo aplica al guardar una categoria
// la relacion con obras y productos no va aca: cada obra o producto guarda el id de su categoria
const categoriaSchema = new Schema<ICategoria>(
  {
    nombre: {
      type: String,
      required: [true, "el nombre es obligatorio"],
      // unique evita tener dos categorias con el mismo nombre
      unique: true,
      trim: true,
    },
  },
  {
    // agrega createdAt y updatedAt solos, sin tener que manejarlos a mano
    timestamps: true,
  }
);

// el modelo que usamos para el crud de categorias, mongo lo guarda en la coleccion "categorias"
export const Categoria = model<ICategoria>("Categoria", categoriaSchema);
