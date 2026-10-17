import { z } from "zod";
import { ESTADOS_TALLER, MODALIDADES } from "../models/taller.model";

// reglas que tiene que cumplir el body al crear o editar un taller
export const tallerSchema = z
  .object({
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
    // en json no existen las fechas, llegan como texto (ej: "2026-11-20T18:00:00.000Z")
    // primero se exige que sea texto y despues se convierte a date
    // no se usa z.coerce.date() solo porque convierte null en el 1 de enero de 1970 y lo daria por valido
    fecha: z
      .string({ error: "la fecha es obligatoria y tiene que ser texto" })
      .pipe(z.coerce.date({ error: "la fecha no es valida" })),
    modalidad: z.enum(MODALIDADES, {
      error: "la modalidad debe ser presencial o virtual",
    }),
    // opcional aca porque depende de la modalidad, la regla de abajo la vuelve obligatoria si es presencial
    direccion: z
      .string({ error: "la direccion tiene que ser texto" })
      .trim()
      .max(200, "la direccion no puede tener mas de 200 caracteres")
      .optional(),
    // sin default aca: al crear lo pone mongoose y al editar no se pisa el valor que ya tenia
    estado: z
      .enum(ESTADOS_TALLER, {
        error: "el estado debe ser abierto, completo o finalizado",
      })
      .optional(),
  })
  // refine mira el objeto entero, porque esta regla necesita comparar dos campos a la vez
  // se valida aca y no solo en mongoose porque el required con funcion no corre en findByIdAndUpdate
  .refine((taller) => taller.modalidad !== "presencial" || taller.direccion, {
    error: "la direccion es obligatoria en los talleres presenciales",
    // path hace que el error aparezca en el campo direccion y no en el objeto entero
    path: ["direccion"],
  });

// tipo que zod arma solo a partir del esquema, para usarlo en el controller
export type TallerInput = z.infer<typeof tallerSchema>;
