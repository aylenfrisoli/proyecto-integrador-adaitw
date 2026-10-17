import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import categoriaRoutes from "./routes/categoria.routes";
import obraRoutes from "./routes/obra.routes";
import { manejarErrores, rutaNoEncontrada } from "./middlewares/error.middleware";

// arma la app de express con sus middlewares, pero no la levanta: de eso se encarga server.ts
const app = express();

// render pone un proxy delante de la api, sin esto todos los pedidos parecen venir de la misma ip
// y el rate limit bloquearia a todo el mundo junto. el 1 es porque hay un solo proxy en el medio
app.set("trust proxy", 1);

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

// rutas de autenticacion: /auth/login
app.use("/auth", authRoutes);

// rutas de categorias: /categorias y /categorias/:id
app.use("/categorias", categoriaRoutes);

// rutas de obras: /obras y /obras/:id
app.use("/obras", obraRoutes);

// estos dos van siempre al final: express prueba los middlewares en orden
// si un pedido llego hasta aca es porque ninguna ruta lo atendio, o porque alguna tiro un error
app.use(rutaNoEncontrada);
app.use(manejarErrores);

export default app;
