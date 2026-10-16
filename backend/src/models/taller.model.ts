import { Schema, model } from "mongoose";

// valores permitidos para la modalidad y el estado, se exportan para reusarlos en la validacion con zod
export const MODALIDADES = ["presencial", "virtual"] as const;
export const ESTADOS_TALLER = ["abierto", "completo", "finalizado"] as const;

// convierten cada array en un tipo con sus valores exactos
export type Modalidad = (typeof MODALIDADES)[number];
export type EstadoTaller = (typeof ESTADOS_TALLER)[number];

// forma de un taller que da sara en typescript
export interface ITaller {
  titulo: string;
  descripcion: string;
  fecha: Date;
  modalidad: Modalidad;
  // opcional en el tipo porque los talleres virtuales no tienen direccion
  direccion?: string;
  estado: EstadoTaller;
}

// reglas que mongo aplica al guardar un taller
const tallerSchema = new Schema<ITaller>(
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
    fecha: {
      // date guarda dia y hora, asi el front puede ordenar y mostrar la fecha como quiera
      type: Date,
      required: [true, "la fecha es obligatoria"],
    },
    modalidad: {
      type: String,
      enum: {
        values: MODALIDADES,
        message: "la modalidad debe ser presencial o virtual",
      },
      required: [true, "la modalidad es obligatoria"],
    },
    direccion: {
      type: String,
      trim: true,
      // required con funcion: solo es obligatoria si el taller es presencial
      // se usa function y no arrow function porque necesitamos el this del documento
      required: [
        function (this: ITaller) {
          return this.modalidad === "presencial";
        },
        "la direccion es obligatoria en los talleres presenciales",
      ],
    },
    estado: {
      type: String,
      enum: {
        values: ESTADOS_TALLER,
        message: "el estado debe ser abierto, completo o finalizado",
      },
      // un taller nuevo arranca con la inscripcion abierta
      default: "abierto",
    },
  },
  {
    // agrega createdAt y updatedAt solos, sin tener que manejarlos a mano
    timestamps: true,
  }
);

// el modelo que usamos para el crud de talleres
// el tercer parametro fija el nombre de la coleccion, porque mongoose pluraliza en ingles y quedaria "tallers"
export const Taller = model<ITaller>("Taller", tallerSchema, "talleres");
