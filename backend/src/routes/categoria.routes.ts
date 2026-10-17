import { Router } from "express";
import {
  createCategoria,
  deleteCategoria,
  getCategoriaById,
  getCategorias,
  updateCategoria,
} from "../controllers/categoria.controller";
import { verificarToken } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { categoriaSchema } from "../schemas/categoria.schema";

const router = Router();

// las lecturas son publicas: la landing las necesita sin que nadie haya iniciado sesion
router.get("/", getCategorias);
router.get("/:id", getCategoriaById);

// las escrituras son solo de la admin: primero se verifica el token y despues se valida el body
// el token va primero para que alguien sin sesion reciba 401 sin que le analicemos los datos
router.post("/", verificarToken, validate(categoriaSchema), createCategoria);
router.put("/:id", verificarToken, validate(categoriaSchema), updateCategoria);
// el delete no manda body, por eso no lleva validate
router.delete("/:id", verificarToken, deleteCategoria);

export default router;
