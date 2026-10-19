# Sección de la caminata (fuera de la landing)

Esta carpeta guarda la sección de la Caminata de Concientización sobre el Cáncer de Mama que se sacó de la web. El código del front está completo, pero **la API también se sacó** (ver `backend/src/exportables/caminata/LEEME.md`): para que la sección funcione hay que volver a poner las dos partes.

## Qué hay

- `Caminata.jsx` y su css: la sección, con un botón por edición y los datos de la elegida.
- `FotoCaminata`: cada foto en su cuadrado con el epígrafe.
- `ApoyoCaminata`: la tarjeta que invita a apoyar el proyecto en Instagram.
- `SelectorEdicion.jsx`: los botones para elegir la edición.
- `CaminataAdmin.jsx` y `CaminataForm.jsx`: la pestaña del panel de administración donde se cargan, editan y borran las ediciones.
- `index.js`: exporta `Caminata` y `CaminataAdmin`.

La sección lee la API (`GET /caminatas`) y usa componentes y utilidades que siguen en el resto del front (`EncabezadoSeccion`, `EstadoDeDatos`, `Forma`, `CampoImagen`, `useFetch`, `utils/caminata.js`, `config/contacto.js`). La API de la caminata (`/caminatas`) ya no está activa: se sacó del backend igual que la sección de la landing y la pestaña del panel.

## Cómo volver a ponerla

0. En el backend: seguir los pasos de `backend/src/exportables/caminata/LEEME.md` para que `/caminatas` vuelva a responder.
1. En `src/pages/HomePage.jsx`: `import { Caminata } from "../exportables/caminata";` y `<Caminata />` entre `<ObrasList />` y `<SobreSara />`, que es donde estaba. Ojo: cada lugar de la landing tiene su color de fondo, así que hay que ajustar el fondo, los textos y las formas de la sección al lugar donde caiga.
2. En `src/config/secciones.js`: sumar `{ id: "caminata", nombre: "Caminata" }` donde corresponda, para que vuelva el link de la navbar y del pie.
3. En `src/pages/AdminPage.jsx`: `import { CaminataAdmin } from "../exportables/caminata";` y sumar `{ id: "caminata", nombre: "Caminata", componente: CaminataAdmin }` a `PANELES`.
