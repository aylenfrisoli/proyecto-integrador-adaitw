import { Request, Response } from "express";
import { Categoria } from "../models/categoria.model";
import { Obra } from "../models/obra.model";
import { ObraInput } from "../schemas/obra.schema";

// devuelve las obras mas nuevas primero, y si viene ?categoria=id solo las de esa categoria
export async function getObras(req: Request, res: Response): Promise<void> {
  const { categoria } = req.query;

  // si ?categoria llega repetido express lo entrega como array, solo aceptamos un texto
  if (categoria !== undefined && typeof categoria !== "string") {
    res.status(400).json({ message: "el filtro categoria tiene que ser un solo id" });
    return;
  }

  // sin filtro el objeto queda vacio y find devuelve todas, con un id mal formado mongoose tira un CastError que atrapa error.middleware
  const filtro = categoria ? { categoria } : {};

  // populate cambia el id de la categoria por la categoria completa, asi el front puede mostrar el nombre
  const obras = await Obra.find(filtro).sort({ createdAt: -1 }).populate("categoria");
  res.json(obras);
}

// busca una obra puntual por id, responde 404 si no existe
export async function getObraById(req: Request, res: Response): Promise<void> {
  const obra = await Obra.findById(req.params.id).populate("categoria");

  if (!obra) {
    res.status(404).json({ message: "obra no encontrada" });
    return;
  }

  res.json(obra);
}

// crea una obra nueva, antes revisa que la categoria elegida exista
export async function createObra(req: Request, res: Response): Promise<void> {
  // el body ya paso por validate(obraSchema), por eso se puede tipar sin dudar
  const datos = req.body as ObraInput;

  // zod solo valido el formato del id, aca se confirma que haya una categoria con ese id
  // es 400 y no 404 porque la url esta bien, el dato incorrecto viene en el body
  if (!(await Categoria.exists({ _id: datos.categoria }))) {
    res.status(400).json({ message: "la categoria indicada no existe" });
    return;
  }

  const obra = await Obra.create(datos);
  // create devuelve la categoria como id, se popula para responder con la misma forma que el get
  await obra.populate("categoria");
  res.status(201).json(obra);
}

// edita una obra completa y devuelve la obra ya actualizada
export async function updateObra(req: Request, res: Response): Promise<void> {
  const datos = req.body as ObraInput;

  // tambien al editar se revisa la categoria, porque el put puede cambiarla por otra
  if (!(await Categoria.exists({ _id: datos.categoria }))) {
    res.status(400).json({ message: "la categoria indicada no existe" });
    return;
  }

  // new: true devuelve el documento despues del cambio y no el viejo
  // runValidators hace que mongoose tambien aplique sus reglas al editar, por defecto solo lo hace al crear
  const obra = await Obra.findByIdAndUpdate(req.params.id, datos, {
    new: true,
    runValidators: true,
  }).populate("categoria");

  if (!obra) {
    res.status(404).json({ message: "obra no encontrada" });
    return;
  }

  res.json(obra);
}

// borra una obra por id, las obras no dependen de nada mas asi que no hay conflicto posible
export async function deleteObra(req: Request, res: Response): Promise<void> {
  const obra = await Obra.findByIdAndDelete(req.params.id);

  if (!obra) {
    res.status(404).json({ message: "obra no encontrada" });
    return;
  }

  // se responde 200 con un mensaje y no 204 sin cuerpo, asi el front siempre puede leer el json de la respuesta
  res.json({ message: "obra eliminada" });
}
