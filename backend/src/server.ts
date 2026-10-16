// tiene que ser el primer import: carga el .env antes de que app.ts y db.ts lean process.env
import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";

// render define su propio puerto en PORT, el 3000 queda para desarrollo
const PORT = process.env.PORT || 3000;

// primero conecta la base y despues levanta el servidor, asi nunca atiende peticiones sin base de datos
async function startServer(): Promise<void> {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    // aca llegan los errores de configuracion, por ejemplo si falta MONGO_URI en el .env
    console.error("no se pudo iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer();
