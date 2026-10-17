import { Request, Response } from "express";
import { Categoria } from "../models/categoria.model";
import { Producto } from "../models/producto.model";
import { ProductoInput } from "../schemas/producto.schema";

// devuelve los productos mas nuevos primero, y si viene ?categoria=id solo los de esa categoria
export async function getProductos(req: Request, res: Response): Promise<void> {
  const { categoria } = req.query;

  // si ?categoria llega repetido express lo entrega como array, solo aceptamos un texto
  if (categoria !== undefined && typeof categoria !== "string") {
    res.status(400).json({ message: "el filtro categoria tiene que ser un solo id" });
    return;
  }

  // sin filtro el objeto queda vacio y find devuelve todos, con un id mal formado mongoose tira un CastError que atrapa error.middleware
  const filtro = categoria ? { categoria } : {};

  // populate cambia el id de la categoria por la categoria completa, asi el front puede mostrar el nombre
  const productos = await Producto.find(filtro).sort({ createdAt: -1 }).populate("categoria");
  res.json(productos);
}

// busca un producto puntual por id, responde 404 si no existe
export async function getProductoById(req: Request, res: Response): Promise<void> {
  const producto = await Producto.findById(req.params.id).populate("categoria");

  if (!producto) {
    res.status(404).json({ message: "producto no encontrado" });
    return;
  }

  res.json(producto);
}

// crea un producto nuevo, antes revisa que la categoria elegida exista
export async function createProducto(req: Request, res: Response): Promise<void> {
  // el body ya paso por validate(productoSchema), por eso se puede tipar sin dudar
  const datos = req.body as ProductoInput;

  // zod solo valido el formato del id, aca se confirma que haya una categoria con ese id
  // es 400 y no 404 porque la url esta bien, el dato incorrecto viene en el body
  if (!(await Categoria.exists({ _id: datos.categoria }))) {
    res.status(400).json({ message: "la categoria indicada no existe" });
    return;
  }

  // el precio puede llegar null (zod lo permite) pero el modelo solo acepta numero o undefined
  // al crear, null y no mandarlo significan lo mismo, asi que se pasa a undefined
  const producto = await Producto.create({ ...datos, precio: datos.precio ?? undefined });
  // create devuelve la categoria como id, se popula para responder con la misma forma que el get
  await producto.populate("categoria");
  res.status(201).json(producto);
}

// edita un producto completo y devuelve el producto ya actualizado
export async function updateProducto(req: Request, res: Response): Promise<void> {
  const datos = req.body as ProductoInput;

  // tambien al editar se revisa la categoria, porque el put puede cambiarla por otra
  if (!(await Categoria.exists({ _id: datos.categoria }))) {
    res.status(400).json({ message: "la categoria indicada no existe" });
    return;
  }

  // al editar null si cuenta: es la forma de sacarle el precio al producto
  // $unset borra el campo de mongo, asi no queda guardado un precio: null
  // si el precio no viene en el body, mongoose ignora la clave y se conserva el que ya tenia
  const { precio, ...resto } = datos;
  const cambios = precio === null ? { ...resto, $unset: { precio: 1 } } : { ...resto, precio };

  // new: true devuelve el documento despues del cambio y no el viejo
  // runValidators hace que mongoose tambien aplique sus reglas al editar, por defecto solo lo hace al crear
  const producto = await Producto.findByIdAndUpdate(req.params.id, cambios, {
    new: true,
    runValidators: true,
  }).populate("categoria");

  if (!producto) {
    res.status(404).json({ message: "producto no encontrado" });
    return;
  }

  res.json(producto);
}

// borra un producto por id, los productos no dependen de nada mas asi que no hay conflicto posible
export async function deleteProducto(req: Request, res: Response): Promise<void> {
  const producto = await Producto.findByIdAndDelete(req.params.id);

  if (!producto) {
    res.status(404).json({ message: "producto no encontrado" });
    return;
  }

  // se responde 200 con un mensaje y no 204 sin cuerpo, asi el front siempre puede leer el json de la respuesta
  res.json({ message: "producto eliminado" });
}
