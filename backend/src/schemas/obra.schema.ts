import { z } from "zod";
import { idDeMongo, urlImagen } from "./comun.schema";

// reglas que tiene que cumplir el body al crear o editar una obra
// el put tambien manda la obra completa, por eso se usa el mismo esquema para los dos
export const obraSchema = z.object({
  titulo: z
    .string({ error: "el titulo es obligatorio y tiene que ser texto" })
    // trim va antes que min para que "   " cuente como vacio y no pase
    .trim()
    .min(1, "el titulo no puede estar vacio")
    .max(100, "el titulo no puede tener mas de 100 caracteres"),
  descripcion: z
    .string({ error: "la descripcion es obligatoria y tiene que ser texto" })
    .trim()
    .min(1, "la descripcion no puede estar vacia")
    .max(1000, "la descripcion no puede tener mas de 1000 caracteres"),
  imagen: urlImagen,
  // solo revisa el formato del id, que la categoria exista de verdad se chequea en el controller
  categoria: idDeMongo("la categoria"),
});

// tipo que zod arma solo a partir del esquema, para usarlo en el controller
export type ObraInput = z.infer<typeof obraSchema>;
