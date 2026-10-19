import { Schema, model } from "mongoose";

// forma de una foto de la caminata en typescript: la data url y un texto corto que va debajo, como en una polaroid
export interface IFoto {
  url: string;
  // opcional: no todas las fotos necesitan un texto
  epigrafe?: string;
}

// forma de una edicion de la caminata en typescript, cada documento es una edicion (1ª, 2ª, 3ª...)
export interface ICaminata {
  // etiqueta de la edicion, es lo que dice el boton en la landing (ej: "1ª edicion")
  nombre: string;
  fecha: Date;
  lugar: string;
  descripcion: string;
  fotos: IFoto[];
}

// las fotos viven dentro de la edicion y no se consultan por separado, por eso son un subdocumento y no una coleccion propia
// _id: false evita que mongoose le ponga un id a cada foto, nadie lo va a usar
const fotoSchema = new Schema<IFoto>(
  {
    url: {
      type: String,
      required: [true, "la foto es obligatoria"],
      trim: true,
    },
    epigrafe: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

// reglas que mongo aplica al guardar una edicion
const caminataSchema = new Schema<ICaminata>(
  {
    nombre: {
      type: String,
      required: [true, "el nombre es obligatorio"],
      trim: true,
    },
    fecha: {
      // date guarda dia y hora, asi el front puede ordenar las ediciones y mostrar la fecha como quiera
      type: Date,
      required: [true, "la fecha es obligatoria"],
    },
    lugar: {
      type: String,
      required: [true, "el lugar es obligatorio"],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, "la descripcion es obligatoria"],
      trim: true,
    },
    // sin required: una edicion se puede cargar antes de tener las fotos
    // mongoose guarda un array vacio por defecto, asi el front siempre recibe una lista
    fotos: [fotoSchema],
  },
  {
    // agrega createdAt y updatedAt solos, sin tener que manejarlos a mano
    timestamps: true,
  }
);

// el modelo que usamos para el crud de la caminata
// mongoose pluraliza solo el nombre de la coleccion y en este caso queda bien: "caminatas"
export const Caminata = model<ICaminata>("Caminata", caminataSchema);
