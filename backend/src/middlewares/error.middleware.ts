import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

// responde 404 cuando el pedido no coincide con ninguna ruta, asi el front recibe json y no el html de express
export function rutaNoEncontrada(req: Request, res: Response) {
  res.status(404).json({ message: `no existe la ruta ${req.method} ${req.originalUrl}` });
}

// atrapa cualquier error que tiren las rutas o los controllers y lo convierte en una respuesta json clara
// express 5 manda aca solos los errores de las funciones async, sin tener que usar try/catch en cada controller
// tiene que recibir los 4 parametros aunque no use next, porque express lo reconoce como manejador de errores por la cantidad
export function manejarErrores(err: unknown, _req: Request, res: Response, next: NextFunction) {
  // si la respuesta ya se empezo a mandar no se puede cambiar, se lo dejamos a express
  if (res.headersSent) {
    next(err);
    return;
  }

  // express.json no pudo leer el body, por ejemplo por una coma o una llave de mas
  if (err instanceof SyntaxError && "type" in err && err.type === "entity.parse.failed") {
    res.status(400).json({ message: "el json enviado no es valido" });
    return;
  }

  // mongoose rechazo los datos al guardar, se responde con la misma forma que validate.middleware
  if (err instanceof mongoose.Error.ValidationError) {
    const errores = Object.values(err.errors).map((error) => ({
      campo: error.path,
      mensaje: error.message,
    }));
    res.status(400).json({ message: "los datos enviados no son validos", errores });
    return;
  }

  // un valor que mongoose no pudo convertir, el caso tipico es un id mal formado en la url (ej: /obras/123)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: `el valor de ${err.path} no es valido` });
    return;
  }

  // 11000 es el codigo de mongo para un valor repetido en un campo unique (ej: dos categorias con el mismo nombre)
  if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
    const campo = Object.keys(err.keyValue ?? {})[0] ?? "campo";
    res.status(409).json({ message: `ya existe un registro con ese ${campo}` });
    return;
  }

  // cualquier otro error: se muestra completo en la terminal para poder arreglarlo
  // pero al cliente no se le mandan detalles internos, para no dar pistas de como esta armado el servidor
  console.error(err);
  res.status(500).json({ message: "ocurrio un error inesperado en el servidor" });
}
