import { z } from "zod";
import { imagenBase64 } from "./comun.schema";

// tope de fotos por edicion: evita documentos enormes y una galeria imposible de recorrer
const MAX_FOTOS = 30;

// reglas de cada foto de la lista
const fotoSchema = z.object({
  url: imagenBase64,
  epigrafe: z
    .string({ error: "el epigrafe tiene que ser texto" })
    .trim()
    .max(120, "el epigrafe no puede tener mas de 120 caracteres")
    // el formulario manda "" cuando la fila no tiene texto, se descarta para no guardar un epigrafe vacio
    .transform((texto) => texto || undefined)
    .optional(),
});

// reglas que tiene que cumplir el body al crear o editar una edicion de la caminata
export const caminataSchema = z.object({
  nombre: z
    .string({ error: "el nombre es obligatorio y tiene que ser texto" })
    // trim va antes que min para que "   " cuente como vacio y no pase
    .trim()
    .min(1, "el nombre no puede estar vacio")
    .max(60, "el nombre no puede tener mas de 60 caracteres"),
  // en json no existen las fechas, llegan como texto (ej: "2026-04-12T12:00:00-03:00")
  // primero se exige que sea texto y despues se convierte a date
  // no se usa z.coerce.date() solo porque convierte null en el 1 de enero de 1970 y lo daria por valido
  fecha: z
    .string({ error: "la fecha es obligatoria y tiene que ser texto" })
    .pipe(z.coerce.date({ error: "la fecha no es valida" })),
  lugar: z
    .string({ error: "el lugar es obligatorio y tiene que ser texto" })
    .trim()
    .min(1, "el lugar no puede estar vacio")
    .max(150, "el lugar no puede tener mas de 150 caracteres"),
  descripcion: z
    .string({ error: "la descripcion es obligatoria y tiene que ser texto" })
    .trim()
    .min(1, "la descripcion no puede estar vacia")
    .max(1000, "la descripcion no puede tener mas de 1000 caracteres"),
  // opcional: al crear mongoose guarda una lista vacia y al editar, si no viene, se conservan las fotos que ya tenia
  // si viene, reemplaza la lista entera (el panel siempre manda todas las fotos)
  fotos: z
    .array(fotoSchema, { error: "las fotos tienen que ser una lista" })
    .max(MAX_FOTOS, `una edicion no puede tener mas de ${MAX_FOTOS} fotos`)
    .optional(),
});

// tipo que zod arma solo a partir del esquema, para usarlo en el controller
export type CaminataInput = z.infer<typeof caminataSchema>;
