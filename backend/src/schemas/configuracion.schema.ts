import { z } from "zod";
import { imagenBase64 } from "./comun.schema";

// reglas que tiene que cumplir el body al guardar la configuracion del sitio
export const configuracionSchema = z.object({
  imagenPortada: z
    .string({ error: "la imagen de la portada es obligatoria y tiene que ser texto" })
    // trim va antes del pipe para que "   " cuente como vacio
    .trim()
    // un texto vacio es valido y quiere decir "sin foto": asi la admin puede sacar la imagen desde el panel
    // si no esta vacio tiene que ser una data url base64
    .pipe(z.union([z.literal(""), imagenBase64], { error: "la imagen tiene que ser una data url base64 valida" })),
  imagenSobreSara: z
    .string({ error: "la imagen de sobre sara tiene que ser texto" })
    .trim()
    .pipe(z.union([z.literal(""), imagenBase64], { error: "la imagen tiene que ser una data url base64 valida" }))
    .optional(),
});

// tipo que zod arma solo a partir del esquema, para usarlo en el controller
export type ConfiguracionInput = z.infer<typeof configuracionSchema>;
