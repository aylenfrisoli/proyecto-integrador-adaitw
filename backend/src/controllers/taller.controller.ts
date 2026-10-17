import { Request, Response } from "express";
import { Taller } from "../models/taller.model";
import { TallerInput } from "../schemas/taller.schema";

// devuelve todos los talleres, los de fecha mas nueva primero
export async function getTalleres(_req: Request, res: Response): Promise<void> {
  // los talleres no tienen categoria, asi que no hay filtro ni populate
  const talleres = await Taller.find().sort({ fecha: -1 });
  res.json(talleres);
}

// busca un taller puntual por id, responde 404 si no existe
export async function getTallerById(req: Request, res: Response): Promise<void> {
  const taller = await Taller.findById(req.params.id);

  if (!taller) {
    res.status(404).json({ message: "taller no encontrado" });
    return;
  }

  res.json(taller);
}

// crea un taller nuevo
export async function createTaller(req: Request, res: Response): Promise<void> {
  // el body ya paso por validate(tallerSchema), por eso se puede tipar sin dudar
  const datos = req.body as TallerInput;

  // un taller virtual no tiene lugar fisico, asi que si vino una direccion no se guarda
  const direccion = datos.modalidad === "virtual" ? undefined : datos.direccion;

  const taller = await Taller.create({ ...datos, direccion });
  res.status(201).json(taller);
}

// edita un taller completo y devuelve el taller ya actualizado
export async function updateTaller(req: Request, res: Response): Promise<void> {
  const datos = req.body as TallerInput;

  // si pasa a virtual hay que borrar la direccion que tenia, porque si no el campo no viene en el body y mongoose conserva la vieja
  // $unset borra el campo de mongo, asi no queda un taller virtual con una direccion guardada
  const { direccion, ...resto } = datos;
  const cambios = datos.modalidad === "virtual" ? { ...resto, $unset: { direccion: 1 } } : { ...resto, direccion };

  // new: true devuelve el documento despues del cambio y no el viejo
  // runValidators hace que mongoose tambien aplique sus reglas al editar, por defecto solo lo hace al crear
  // el required de la direccion en presenciales no corre aca, por eso lo garantiza el refine de zod
  const taller = await Taller.findByIdAndUpdate(req.params.id, cambios, {
    new: true,
    runValidators: true,
  });

  if (!taller) {
    res.status(404).json({ message: "taller no encontrado" });
    return;
  }

  res.json(taller);
}

// borra un taller por id, los talleres no dependen de nada mas asi que no hay conflicto posible
export async function deleteTaller(req: Request, res: Response): Promise<void> {
  const taller = await Taller.findByIdAndDelete(req.params.id);

  if (!taller) {
    res.status(404).json({ message: "taller no encontrado" });
    return;
  }

  // se responde 200 con un mensaje y no 204 sin cuerpo, asi el front siempre puede leer el json de la respuesta
  res.json({ message: "taller eliminado" });
}
