import rateLimit from "express-rate-limit";

// limita los intentos de login por ip para frenar ataques de fuerza bruta
export const limitarLogin = rateLimit({
  // ventana de 15 minutos
  windowMs: 15 * 60 * 1000,
  // maximo de intentos dentro de la ventana, despues responde 429
  limit: 5,
  // solo cuentan los intentos fallidos (status 4xx/5xx), asi sara no se bloquea a si misma al entrar bien
  skipSuccessfulRequests: true,
  // manda los headers estandar RateLimit-* para saber cuantos intentos quedan, y saca los X-RateLimit-* viejos
  standardHeaders: "draft-8",
  legacyHeaders: false,
  // misma forma de respuesta que el resto de la api: un json con message
  message: { message: "demasiados intentos fallidos, proba de nuevo en 15 minutos" },
});
