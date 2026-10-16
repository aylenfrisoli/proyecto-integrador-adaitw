import mongoose from "mongoose";

// conecta la api con mongodb atlas usando la uri del .env
export async function connectDB(): Promise<void> {
  // se lee adentro de la funcion y no arriba del archivo, asi dotenv ya cargo el .env cuando se llama
  const mongoUri = process.env.MONGO_URI;

  // sin uri no hay a donde conectarse, mejor avisar claro que fallar con un error raro de mongoose
  if (!mongoUri) {
    throw new Error("falta la variable MONGO_URI en el archivo .env");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log(`conectado a mongodb, base: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("no se pudo conectar a mongodb:", error);
    // una api sin base de datos no sirve, cortamos el proceso para enterarnos enseguida
    process.exit(1);
  }
}
