import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// recibe un esquema de zod y devuelve un middleware que valida el body con ese esquema
// asi se arma una sola vez y en cada ruta se usa con el esquema que toque, ej: validate(obraSchema)
export function validate(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    // si no llega body, express 5 deja req.body en undefined
    // se valida un objeto vacio para que zod devuelva el error de cada campo y no uno generico
    const resultado = schema.safeParse(req.body ?? {});

    if (!resultado.success) {
      // se arma una lista simple con el campo y el mensaje, facil de mostrar en el formulario del front
      const errores = resultado.error.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensaje: issue.message,
      }));
      res.status(400).json({ message: "los datos enviados no son validos", errores });
      return;
    }

    // se pisa el body con los datos ya limpios: sin espacios de mas, sin campos extra y con la fecha como date
    req.body = resultado.data;
    next();
  };
}
