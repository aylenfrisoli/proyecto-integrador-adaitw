import { z } from "zod";

// reglas que se repiten en varias entidades, se arman una sola vez y se reusan en cada esquema

// valida que el texto sea un id de mongo: 24 caracteres hexadecimales (numeros y letras de la a a la f)
// se usa un regex y no Types.ObjectId.isValid porque ese tambien acepta cualquier texto de 12 caracteres
export function idDeMongo(campo: string) {
  return z
    // el mensaje no usa "obligatorio/a" para que sirva igual con cualquier campo
    .string({ error: `falta ${campo} o no es texto` })
    .regex(/^[0-9a-fA-F]{24}$/, `${campo} no es un id valido`);
}

// valida la url de una imagen, solo http o https
// asi nadie puede guardar algo como "javascript:..." que despues el front pinte en la pagina
export const urlImagen = z
  .httpUrl({ error: "la imagen tiene que ser una url que empiece con http o https" })
  .trim();
