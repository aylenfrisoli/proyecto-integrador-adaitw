import { Request, Response } from "express";
import { Categoria } from "../models/categoria.model";
import { Obra } from "../models/obra.model";
import { Producto } from "../models/producto.model";
import { CategoriaInput } from "../schemas/categoria.schema";

// devuelve todas las categorias ordenadas por nombre, asi el front las muestra siempre igual
export async function getCategorias(_req: Request, res: Response): Promise<void> {
  const categorias = await Categoria.find().sort({ nombre: 1 });
  res.json(categorias);
}

// busca una categoria puntual por id, responde 404 si no existe
export async function getCategoriaById(req: Request, res: Response): Promise<void> {
  const categoria = await Categoria.findById(req.params.id);

  // findById devuelve null cuando el id tiene buen formato pero no hay ninguna categoria con ese id
  if (!categoria) {
    res.status(404).json({ message: "categoria no encontrada" });
    return;
  }

  res.json(categoria);
}

// crea una categoria nueva, si el nombre ya existe el error 11000 lo convierte en 409 error.middleware
export async function createCategoria(req: Request, res: Response): Promise<void> {
  // el body ya paso por validate(categoriaSchema), por eso se puede tipar sin dudar
  const datos = req.body as CategoriaInput;

  const categoria = await Categoria.create(datos);
  res.status(201).json(categoria);
}

// edita el nombre de una categoria y devuelve la categoria ya actualizada
export async function updateCategoria(req: Request, res: Response): Promise<void> {
  const datos = req.body as CategoriaInput;

  // new: true devuelve el documento despues del cambio y no el viejo
  // runValidators hace que mongoose tambien aplique sus reglas al editar, por defecto solo lo hace al crear
  const categoria = await Categoria.findByIdAndUpdate(req.params.id, datos, {
    new: true,
    runValidators: true,
  });

  if (!categoria) {
    res.status(404).json({ message: "categoria no encontrada" });
    return;
  }

  res.json(categoria);
}

// borra una categoria, pero solo si ninguna obra ni producto la esta usando
export async function deleteCategoria(req: Request, res: Response): Promise<void> {
  const id = req.params.id;

  const cantidadObras = await Obra.countDocuments({ categoria: id });
  const cantidadProductos = await Producto.countDocuments({ categoria: id });

  // si se borrara igual, esas obras y productos quedarian apuntando a una categoria que ya no existe
  if (cantidadObras > 0 || cantidadProductos > 0) {
    res.status(409).json({
      message: `no se puede borrar la categoria porque tiene ${cantidadObras} obra(s) y ${cantidadProductos} producto(s) asociados`,
    });
    return;
  }

  const categoria = await Categoria.findByIdAndDelete(id);

  if (!categoria) {
    res.status(404).json({ message: "categoria no encontrada" });
    return;
  }

  // se responde 200 con un mensaje y no 204 sin cuerpo, asi el front siempre puede leer el json de la respuesta
  res.json({ message: "categoria eliminada" });
}
