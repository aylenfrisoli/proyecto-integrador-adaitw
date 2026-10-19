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

const TAMANO_MAXIMO_IMAGEN = 4 * 1024 * 1024;

// valida data urls de imagen y limita el contenido decodificado a 4 mib
export const imagenBase64 = z
  .string({ error: "la imagen tiene que ser texto en formato base64" })
  .refine((dataUrl) => {
    const separador = dataUrl.indexOf(",");
    if (separador < 0 || !/^data:image\/[a-zA-Z0-9.+-]+;base64$/.test(dataUrl.slice(0, separador))) {
      return false;
    }

    const base64 = dataUrl.slice(separador + 1);
    if (base64.length === 0 || base64.length % 4 !== 0) return false;

    const relleno = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
    const largoContenido = base64.length - relleno;
    for (let indice = 0; indice < largoContenido; indice += 1) {
      const codigo = base64.charCodeAt(indice);
      const esLetra = (codigo >= 65 && codigo <= 90) || (codigo >= 97 && codigo <= 122);
      const esNumero = codigo >= 48 && codigo <= 57;
      if (!esLetra && !esNumero && codigo !== 43 && codigo !== 47) return false;
    }

    return relleno === 0 || largoContenido % 4 === 4 - relleno;
  }, "la imagen tiene que ser una data url base64 valida")
  .refine((dataUrl) => {
    const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
    const relleno = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
    const tamanoBytes = Math.floor((base64.length * 3) / 4) - relleno;
    return tamanoBytes <= TAMANO_MAXIMO_IMAGEN;
  }, "la imagen no puede superar los 4 mb");
