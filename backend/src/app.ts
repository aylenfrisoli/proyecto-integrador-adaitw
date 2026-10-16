import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

// arma la app de express con sus middlewares, pero no la levanta: de eso se encarga server.ts
const app = express();

// headers de seguridad, va primero para que cubra todas las respuestas
app.use(helmet());

// solo el front configurado en el .env puede consumir la api desde el navegador
app.use(cors({ origin: process.env.CORS_ORIGIN }));

// muestra cada peticion en la terminal, sirve para ver que llega mientras probamos con postman
app.use(morgan("dev"));

// convierte el body json de las peticiones en req.body
app.use(express.json());

// ruta de prueba para saber si la api esta viva, tambien la usa render para chequear el deploy
app.get("/", (_req, res) => {
  res.json({ message: "api de sara figarra funcionando" });
});

export default app;
