import { z } from "zod";
import { urlImagen } from "./comun.schema";

// reglas que tiene que cumplir el body al guardar la configuracion del sitio
export const configuracionSchema = z.object({
  imagenPortada: z
    .string({ error: "la imagen de la portada es obligatoria y tiene que ser texto" })
    // trim va antes del pipe para que "   " cuente como vacio
    .trim()
    // un texto vacio es valido y quiere decir "sin foto": asi la admin puede sacar la imagen desde el panel
    // si no esta vacio tiene que ser una url http o https, igual que las imagenes de obras y productos
    .pipe(z.union([z.literal(""), urlImagen], { error: "la imagen tiene que ser una url que empiece con http o https" })),
});

// tipo que zod arma solo a partir del esquema, para usarlo en el controller
export type ConfiguracionInput = z.infer<typeof configuracionSchema>;
