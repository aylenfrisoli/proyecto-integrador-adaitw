import { z } from "zod";

// reglas que tiene que cumplir el body al hacer login
export const loginSchema = z.object({
  email: z
    .string({ error: "el email es obligatorio y tiene que ser texto" })
    // se limpia y pasa a minuscula antes de validar, porque en la base los emails se guardan asi
    .trim()
    .toLowerCase()
    .pipe(z.email("el email no tiene un formato valido")),
  password: z
    .string({ error: "la contraseña es obligatoria y tiene que ser texto" })
    // aca solo se chequea que venga algo, si es correcta o no lo decide bcrypt en el controller
    .min(1, "la contraseña no puede estar vacia"),
});

// tipo que zod arma solo a partir del esquema, para usarlo en el controller
export type LoginInput = z.infer<typeof loginSchema>;
