import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { limitarLogin } from "../middlewares/rateLimit.middleware";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema } from "../schemas/auth.schema";

const router = Router();

// POST /auth/login: primero se limitan los intentos, despues se valida el body y recien al final se intenta el login
// el limite va primero para que tambien cuenten los pedidos con datos invalidos
router.post("/login", limitarLogin, validate(loginSchema), login);

export default router;
