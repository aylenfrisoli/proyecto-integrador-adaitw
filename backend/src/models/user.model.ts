import { Schema, model } from "mongoose";

// forma de un usuario en typescript, asi el editor nos avisa si usamos un campo que no existe
export interface IUser {
  nombre: string;
  email: string;
  password: string;
}

// reglas que mongo aplica al guardar un usuario (la cuenta admin de sara)
const userSchema = new Schema<IUser>(
  {
    nombre: {
      type: String,
      required: [true, "el nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "el email es obligatorio"],
      // unique crea un indice en mongo, asi no puede haber dos cuentas con el mismo email
      unique: true,
      // se guarda en minuscula y sin espacios para que "Sara@Mail.com " y "sara@mail.com" sean el mismo
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "la contraseña es obligatoria"],
      // aca nunca llega la password en texto plano, el seed la guarda ya hasheada con bcrypt
    },
  },
  {
    // agrega createdAt y updatedAt solos, sin tener que manejarlos a mano
    timestamps: true,
  }
);

// el modelo es lo que usamos para buscar y crear usuarios, mongo lo guarda en la coleccion "users"
export const User = model<IUser>("User", userSchema);
