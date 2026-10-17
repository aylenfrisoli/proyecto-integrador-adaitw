import { Router } from "express";
import {
  createProducto,
  deleteProducto,
  getProductoById,
  getProductos,
  updateProducto,
} from "../controllers/producto.controller";
import { verificarToken } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { productoSchema } from "../schemas/producto.schema";

const router = Router();

// las lecturas son publicas: la landing muestra los productos sin que nadie haya iniciado sesion
// get / acepta ?categoria=id para filtrar
router.get("/", getProductos);
router.get("/:id", getProductoById);

// las escrituras son solo de la admin: primero se verifica el token y despues se valida el body
// el token va primero para que alguien sin sesion reciba 401 sin que le analicemos los datos
router.post("/", verificarToken, validate(productoSchema), createProducto);
router.put("/:id", verificarToken, validate(productoSchema), updateProducto);
// el delete no manda body, por eso no lleva validate
router.delete("/:id", verificarToken, deleteProducto);

export default router;
