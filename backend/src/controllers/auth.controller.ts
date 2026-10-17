import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../models/user.model";
import { LoginInput } from "../schemas/auth.schema";

// hash de una contraseña inventada, se usa para comparar cuando el email no existe
// asi tarda lo mismo que con un usuario real y no se puede adivinar que emails estan registrados (timing attack)
const HASH_FALSO = bcrypt.hashSync("contraseña-que-nadie-usa", 10);

// valida las credenciales de la admin y devuelve un token jwt si son correctas
export async function login(req: Request, res: Response): Promise<void> {
  // el body ya pasó por validate(loginSchema), por eso se puede tipar sin dudar
  const { email, password } = req.body as LoginInput;

  const usuario = await User.findOne({ email });

  // se compara siempre, exista el usuario o no, para que el tiempo de respuesta sea parecido
  const hashAComparar = usuario ? usuario.password : HASH_FALSO;
  const passwordCorrecta = await bcrypt.compare(password, hashAComparar);

  // un solo mensaje para "email inexistente" y "contraseña incorrecta", asi no damos pistas
  if (!usuario || !passwordCorrecta) {
    res.status(401).json({ message: "credenciales invalidas" });
    return;
  }

  const secreto = process.env.JWT_SECRET;
  // sin secreto no se puede firmar nada, es un error nuestro de configuracion y no del cliente
  if (!secreto) {
    throw new Error("falta la variable JWT_SECRET en el archivo .env");
  }

  // el token solo lleva el id: no se mete la contraseña ni nada sensible porque el payload se puede leer
  const token = jwt.sign({ id: usuario.id }, secreto, {
    // el .env lo trae como string ("1d") y typescript pide un tipo mas especifico, por eso el cast
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "1d") as SignOptions["expiresIn"],
  });

  res.json({
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
  });
}
