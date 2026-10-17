import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema } from "../schemas/auth.schema";

const router = Router();

// POST /auth/login: primero se valida el body y recien despues se intenta el login
// el rate limit de los intentos se suma aca mas adelante
router.post("/login", validate(loginSchema), login);

export default router;
