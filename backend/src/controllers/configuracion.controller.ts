import { Request, Response } from "express";
import { Configuracion } from "../models/configuracion.model";
import { ConfiguracionInput } from "../schemas/configuracion.schema";

// devuelve la configuracion del sitio, que es un unico documento
export async function getConfiguracion(_req: Request, res: Response): Promise<void> {
  const configuracion = await Configuracion.findOne();

  // si todavia no se guardo nada se responde el valor por defecto, asi el front no tiene que manejar un 404
  res.json(configuracion ?? { imagenPortada: "", imagenSobreSara: "" });
}

// guarda la configuracion y devuelve el documento ya actualizado
export async function updateConfiguracion(req: Request, res: Response): Promise<void> {
  // el body ya paso por validate(configuracionSchema), por eso se puede tipar sin dudar
  const datos = req.body as ConfiguracionInput;

  // el filtro vacio {} agarra el unico documento que hay
  // upsert: si todavia no existe lo crea, asi la primera vez que se guarda no hace falta un paso aparte
  // new: true devuelve el documento despues del cambio y no el viejo
  // runValidators hace que mongoose tambien aplique sus reglas al editar, por defecto solo lo hace al crear
  const configuracion = await Configuracion.findOneAndUpdate({}, datos, {
    upsert: true,
    new: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });

  res.json(configuracion);
}
