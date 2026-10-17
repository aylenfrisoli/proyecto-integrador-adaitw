// funciones puras para trabajar con la categoria de obras y productos (la api la manda poblada: { _id, nombre })

// devuelve las categorias que realmente usan los items, sin repetir y ordenadas por nombre
// asi el filtro no muestra categorias vacias
export function obtenerCategorias(items) {
  // un map con el id como clave descarta las repetidas sin recorrer el array dos veces
  const porId = new Map(items.map((item) => [item.categoria._id, item.categoria]));
  return [...porId.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));
}

// filtra los items por id de categoria; sin id (opcion "Todas") devuelve la lista completa
export function filtrarPorCategoria(items, categoriaId) {
  if (!categoriaId) {
    return items;
  }
  return items.filter((item) => item.categoria._id === categoriaId);
}
