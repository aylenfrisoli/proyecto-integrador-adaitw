// funciones puras para mostrar los datos de un producto

// texto que se muestra por cada valor de disponibilidad que manda la api
export const ETIQUETAS_DISPONIBILIDAD = {
  disponible: "Disponible",
  agotado: "Agotado",
  por_encargo: "Por encargo",
};

// formatea el precio en pesos argentinos; si el producto no tiene precio la api no manda el campo
export function formatearPrecio(precio) {
  // se compara con undefined y null y no con "!precio" porque un precio de 0 es valido
  if (precio === undefined || precio === null) {
    return "Consultar precio";
  }
  // es-AR separa los miles con punto; sin decimales porque los precios son enteros
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(precio);
}

// mensaje de whatsapp del producto: el que cargo sara o, si no hay, uno generico con el titulo
export function armarMensajeProducto(producto) {
  return (
    producto.mensajeWhatsapp ||
    `Hola Sara! Me interesa "${producto.titulo}". ¿Me pasás más información?`
  );
}
