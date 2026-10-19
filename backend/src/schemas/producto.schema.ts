import { z } from "zod";
import { DISPONIBILIDADES } from "../models/producto.model";
import { idDeMongo, imagenBase64 } from "./comun.schema";

// reglas que tiene que cumplir el body al crear o editar un producto
export const productoSchema = z.object({
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
  precio: z
    .number({ error: "el precio tiene que ser un numero" })
    .min(0, "el precio no puede ser negativo")
    // nullable deja mandar null para sacarle el precio a un producto al editarlo
    // optional deja no mandarlo, y en los dos casos el front muestra "consultar precio"
    .nullable()
    .optional(),
  imagen: imagenBase64,
  mensajeWhatsapp: z
    .string({ error: "el mensaje de whatsapp tiene que ser texto" })
    .trim()
    // sin min: un texto vacio es valido y el front usa el mensaje generico
    .max(500, "el mensaje de whatsapp no puede tener mas de 500 caracteres")
    .optional(),
  // se reusa la lista del modelo, asi si se agrega una opcion se cambia en un solo lugar
  // sin default aca: al crear lo pone mongoose y al editar no se pisa el valor que ya tenia
  disponibilidad: z
    .enum(DISPONIBILIDADES, {
      error: "la disponibilidad debe ser disponible, agotado o por_encargo",
    })
    .optional(),
  // solo revisa el formato del id, que la categoria exista de verdad se chequea en el controller
  categoria: idDeMongo("la categoria"),
});

// tipo que zod arma solo a partir del esquema, para usarlo en el controller
export type ProductoInput = z.infer<typeof productoSchema>;
