import { z } from "zod";

// reglas que tiene que cumplir el body al crear o editar una categoria
// se valida antes de llegar al controller, asi a mongo solo le llegan datos limpios
export const categoriaSchema = z.object({
  nombre: z
    .string({ error: "el nombre es obligatorio y tiene que ser texto" })
    // trim va antes que min para que "   " cuente como vacio y no pase
    .trim()
    .min(1, "el nombre no puede estar vacio")
    .max(50, "el nombre no puede tener mas de 50 caracteres"),
});

// tipo que zod arma solo a partir del esquema, para usarlo en el controller
export type CategoriaInput = z.infer<typeof categoriaSchema>;
