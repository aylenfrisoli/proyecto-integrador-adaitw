import { Request, Response } from "express";
import { Caminata } from "./caminata.model";
import { CaminataInput } from "./caminata.schema";

// devuelve todas las ediciones, de la mas vieja a la mas nueva
export async function getCaminatas(_req: Request, res: Response): Promise<void> {
  // orden ascendente porque asi se leen las ediciones (1ª, 2ª, 3ª) y el front muestra los botones en ese orden
  // no hay categoria ni otra relacion, asi que no hay filtro ni populate
  const caminatas = await Caminata.find().sort({ fecha: 1 });
  res.json(caminatas);
}

// busca una edicion puntual por id, responde 404 si no existe
export async function getCaminataById(req: Request, res: Response): Promise<void> {
  const caminata = await Caminata.findById(req.params.id);

  if (!caminata) {
    res.status(404).json({ message: "edicion de la caminata no encontrada" });
    return;
  }

  res.json(caminata);
}

// crea una edicion nueva
export async function createCaminata(req: Request, res: Response): Promise<void> {
  // el body ya paso por validate(caminataSchema), por eso se puede tipar sin dudar
  const datos = req.body as CaminataInput;

  const caminata = await Caminata.create(datos);
  res.status(201).json(caminata);
}

// edita una edicion y devuelve la edicion ya actualizada
export async function updateCaminata(req: Request, res: Response): Promise<void> {
  const datos = req.body as CaminataInput;

  // new: true devuelve el documento despues del cambio y no el viejo
  // runValidators hace que mongoose tambien aplique sus reglas al editar, por defecto solo lo hace al crear
  const caminata = await Caminata.findByIdAndUpdate(req.params.id, datos, {
    new: true,
    runValidators: true,
  });

  if (!caminata) {
    res.status(404).json({ message: "edicion de la caminata no encontrada" });
    return;
  }

  res.json(caminata);
}

// borra una edicion por id, no depende de nada mas asi que no hay conflicto posible
export async function deleteCaminata(req: Request, res: Response): Promise<void> {
  const caminata = await Caminata.findByIdAndDelete(req.params.id);

  if (!caminata) {
    res.status(404).json({ message: "edicion de la caminata no encontrada" });
    return;
  }

  // se responde 200 con un mensaje y no 204 sin cuerpo, asi el front siempre puede leer el json de la respuesta
  res.json({ message: "edicion de la caminata eliminada" });
}
