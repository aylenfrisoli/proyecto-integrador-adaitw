import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// protege una ruta: deja pasar solo si el pedido trae un token jwt valido
// se usa en las rutas de escritura, ej: router.post("/", verificarToken, validate(obraSchema), crearObra)
export function verificarToken(req: Request, res: Response, next: NextFunction): void {
  // el token viene en el header "Authorization: Bearer <token>"
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "falta el token de autenticacion" });
    return;
  }

  // se saca el "Bearer " del principio y queda solo el token
  const token = header.slice("Bearer ".length);

  const secreto = process.env.JWT_SECRET;
  // sin secreto no se puede verificar nada, es un error de configuracion nuestro y no del cliente
  if (!secreto) {
    throw new Error("falta la variable JWT_SECRET en el archivo .env");
  }

  try {
    // verify revisa la firma y la fecha de vencimiento, si algo falla tira un error
    const payload = jwt.verify(token, secreto);
    // el payload puede ser un string, pero el nuestro siempre es un objeto con el id que firmamos en el login
    if (typeof payload === "string") {
      res.status(401).json({ message: "token invalido o vencido" });
      return;
    }
    // res.locals sirve para pasarle datos al siguiente middleware o controller de este mismo pedido
    res.locals.usuarioId = payload.id;
    next();
  } catch {
    // mismo mensaje para token vencido, alterado o mal formado, asi no damos pistas
    res.status(401).json({ message: "token invalido o vencido" });
  }
}
