# API de la caminata (fuera del proyecto)

Esta carpeta guarda la API de la Caminata de Concientización sobre el Cáncer de Mama, que se sacó del proyecto junto con su sección de la landing y su pestaña del panel. El código está completo y compila, pero la API ya no la usa: `GET /caminatas` responde `404`. **No se borró ni se tocaron los datos:** la colección `caminatas` sigue en MongoDB Atlas con lo que ya tenía.

## Qué hay

- `caminata.model.ts`: el modelo `Caminata`. Cada documento es una edición (`nombre`, `fecha`, `lugar`, `descripcion` y `fotos`, una lista de `{ url, epigrafe? }` sin `_id`). Colección `caminatas`.
- `caminata.schema.ts`: las reglas de Zod (hasta 30 fotos por edición, cada una una Data URL Base64 de hasta 4 MB).
- `caminata.controller.ts` y `caminata.routes.ts`: el CRUD (`GET` público, `POST`, `PUT` y `DELETE` con token).
- `seed-caminata.ts`: tres ediciones de ejemplo y su borrado, para el seed demo.
- `postman-caminatas.json`: los requests de Postman de la carpeta «Caminatas» y los de borrado de ediciones.

Un envío no puede pasar los 10 MB del límite del body, así que las fotos de una edición tienen que ser livianas (entre todas, menos de 10 MB).

## Cómo volver a ponerla

1. En `src/app.ts`: `import caminataRoutes from "./exportables/caminata/caminata.routes";` y `app.use("/caminatas", caminataRoutes);` junto a las otras rutas.
2. En `src/scripts/seed-demo.ts` (opcional, para los datos de ejemplo): importar `cargarCaminatasDemo` y `borrarCaminatasDemo` de `../exportables/caminata/seed-caminata`, llamar a `cargarCaminatasDemo(imagen)` al final de `cargarDemo` y a `borrarCaminatasDemo(imagen)` en `borrarDemo`.
3. En Postman: sumar el contenido de `postman-caminatas.json` a la colección (las instrucciones están en su campo `_leeme`).
4. En el README: volver a documentar la sección de Caminatas y los conteos de Postman.
5. El front se vuelve a conectar desde `frontend/src/exportables/caminata/` (ver su `LEEME.md`).
