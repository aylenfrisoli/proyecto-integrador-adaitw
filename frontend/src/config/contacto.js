// numero de whatsapp de sara, con codigo de pais y sin signos ni espacios (argentina: 54 + 9 + area + numero)
// OJO: es un numero de ejemplo, hay que reemplazarlo por el real cuando sara lo pase
export const WHATSAPP_NUMERO = "5491100000000";

// arma el link que abre whatsapp con el mensaje ya escrito
// encodeURIComponent convierte espacios, tildes y signos para que no rompan la url
export function armarLinkWhatsapp(mensaje) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

// perfiles de sara en redes sociales; el id elige el icono en el footer
export const REDES = [
  { id: "instagram", nombre: "Instagram", url: "https://instagram.com/safcreacionesparavos" },
  { id: "facebook", nombre: "Facebook", url: "https://facebook.com/safcreacionesparavos" },
];

// cuenta de instagram de la caminata: es distinta a la de sara y la usa la invitacion a apoyar el proyecto
export const INSTAGRAM_CAMINATA = {
  usuario: "mariposasrosas2024",
  url: "https://www.instagram.com/mariposasrosas2024/",
};
