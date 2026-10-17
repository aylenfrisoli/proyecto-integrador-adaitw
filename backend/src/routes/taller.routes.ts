import { Router } from "express";
import {
  createTaller,
  deleteTaller,
  getTallerById,
  getTalleres,
  updateTaller,
} from "../controllers/taller.controller";
import { verificarToken } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { tallerSchema } from "../schemas/taller.schema";

const router = Router();

// las lecturas son publicas: la landing muestra los talleres sin que nadie haya iniciado sesion
router.get("/", getTalleres);
router.get("/:id", getTallerById);

// las escrituras son solo de la admin: primero se verifica el token y despues se valida el body
// el token va primero para que alguien sin sesion reciba 401 sin que le analicemos los datos
router.post("/", verificarToken, validate(tallerSchema), createTaller);
router.put("/:id", verificarToken, validate(tallerSchema), updateTaller);
// el delete no manda body, por eso no lleva validate
router.delete("/:id", verificarToken, deleteTaller);

export default router;
