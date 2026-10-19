import { Router } from "express";
import {
  createCaminata,
  deleteCaminata,
  getCaminataById,
  getCaminatas,
  updateCaminata,
} from "./caminata.controller";
import { verificarToken } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { caminataSchema } from "./caminata.schema";

const router = Router();

// las lecturas son publicas: la landing muestra las ediciones sin que nadie haya iniciado sesion
router.get("/", getCaminatas);
router.get("/:id", getCaminataById);

// las escrituras son solo de la admin: primero se verifica el token y despues se valida el body
// el token va primero para que alguien sin sesion reciba 401 sin que le analicemos los datos
router.post("/", verificarToken, validate(caminataSchema), createCaminata);
router.put("/:id", verificarToken, validate(caminataSchema), updateCaminata);
// el delete no manda body, por eso no lleva validate
router.delete("/:id", verificarToken, deleteCaminata);

export default router;
