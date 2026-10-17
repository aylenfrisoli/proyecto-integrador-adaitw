// carga el .env antes de leer cualquier variable, igual que en server.ts
import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { User } from "../models/user.model";

// rondas de salt de bcrypt: 10 es el valor habitual, mas rondas = mas seguro pero mas lento
const SALT_ROUNDS = 10;

// crea la cuenta admin de sara a partir del .env, no hay registro publico en la api
async function seed(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  // sin estos datos no hay cuenta que crear, avisamos claro en vez de guardar algo vacio
  if (!email || !password) {
    throw new Error("faltan ADMIN_EMAIL o ADMIN_PASSWORD en el archivo .env");
  }

  await connectDB();

  // se busca en minuscula porque el modelo guarda el email asi
  const existente = await User.findOne({ email: email.toLowerCase().trim() });
  // si ya existe no se crea otra, asi el seed se puede correr las veces que haga falta
  if (existente) {
    console.log(`el admin ${existente.email} ya existe, no se hizo nada`);
    return;
  }

  // se guarda el hash y nunca la contraseña en texto plano
  const passwordHasheada = await bcrypt.hash(password, SALT_ROUNDS);
  const admin = await User.create({
    nombre: "Sara Figarra",
    email,
    password: passwordHasheada,
  });

  console.log(`admin creado: ${admin.email}`);
}

seed()
  .catch((error) => {
    console.error("fallo el seed:", error);
    // codigo distinto de 0 para que quede claro que el script termino mal
    process.exitCode = 1;
  })
  // se cierra la conexion pase lo que pase, si no el proceso queda colgado esperando
  .finally(() => mongoose.disconnect());
