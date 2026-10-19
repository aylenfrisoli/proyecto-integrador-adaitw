import { Router } from "express";
import {
  getConfiguracion,
  updateConfiguracion,
} from "../controllers/configuracion.controller";
import { verificarToken } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { configuracionSchema } from "../schemas/configuracion.schema";

const router = Router();

// la lectura es publica: la landing necesita la foto de la portada sin que nadie haya iniciado sesion
router.get("/", getConfiguracion);

// la escritura es solo de la admin: primero se verifica el token y despues se valida el body
// no hay POST ni DELETE: el documento se crea solo la primera vez que se guarda
router.put("/", verificarToken, validate(configuracionSchema), updateConfiguracion);

export default router;
