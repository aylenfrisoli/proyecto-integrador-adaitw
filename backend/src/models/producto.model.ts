import { Schema, Types, model } from "mongoose";

// valores permitidos para la disponibilidad, se exportan para reusarlos en la validacion con zod
export const DISPONIBILIDADES = ["disponible", "agotado", "por_encargo"] as const;

// convierte el array en un tipo: "disponible" | "agotado" | "por_encargo"
export type Disponibilidad = (typeof DISPONIBILIDADES)[number];

// forma de un producto a la venta en typescript (laminas, ceramicas, etc)
export interface IProducto {
  titulo: string;
  descripcion: string;
  // opcional: si no hay precio el front muestra "consultar precio"
  precio?: number;
  imagen: string;
  // opcional: si no viene, el front arma un mensaje generico con el titulo del producto
  mensajeWhatsapp?: string;
  disponibilidad: Disponibilidad;
  categoria: Types.ObjectId;
}

// reglas que mongo aplica al guardar un producto
const productoSchema = new Schema<IProducto>(
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
    precio: {
      type: Number,
      // sin required, pero si viene no puede ser negativo
      min: [0, "el precio no puede ser negativo"],
    },
    imagen: {
      type: String,
      // guarda la data url completa de la imagen
      required: [true, "la imagen es obligatoria"],
      trim: true,
    },
    mensajeWhatsapp: {
      type: String,
      trim: true,
    },
    disponibilidad: {
      type: String,
      // enum rechaza cualquier valor que no este en la lista
      enum: {
        values: DISPONIBILIDADES,
        message: "la disponibilidad debe ser disponible, agotado o por_encargo",
      },
      // si no se manda, un producto nuevo arranca como disponible
      default: "disponible",
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

// el modelo que usamos para el crud de productos, mongo lo guarda en la coleccion "productos"
export const Producto = model<IProducto>("Producto", productoSchema);
