import { Router } from "express";
import {
  createObra,
  deleteObra,
  getObraById,
  getObras,
  updateObra,
} from "../controllers/obra.controller";
import { verificarToken } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { obraSchema } from "../schemas/obra.schema";

const router = Router();

// las lecturas son publicas: la landing muestra las obras sin que nadie haya iniciado sesion
// get / acepta ?categoria=id para filtrar
router.get("/", getObras);
router.get("/:id", getObraById);

// las escrituras son solo de la admin: primero se verifica el token y despues se valida el body
// el token va primero para que alguien sin sesion reciba 401 sin que le analicemos los datos
router.post("/", verificarToken, validate(obraSchema), createObra);
router.put("/:id", verificarToken, validate(obraSchema), updateObra);
// el delete no manda body, por eso no lleva validate
router.delete("/:id", verificarToken, deleteObra);

export default router;
