# Sección de la caminata (fuera de la landing)

Esta carpeta guarda la sección de la Caminata de Concientización sobre el Cáncer de Mama que se sacó de la web. Todo lo de adentro sigue funcionando: solo falta mostrarla.

## Qué hay

- `Caminata.jsx` y su css: la sección, con un botón por edición y los datos de la elegida.
- `FotoCaminata`: cada foto en su cuadrado con el epígrafe.
- `ApoyoCaminata`: la tarjeta que invita a apoyar el proyecto en Instagram.
- `SelectorEdicion.jsx`: los botones para elegir la edición.
- `index.js`: exporta `Caminata`.

La sección lee la API (`GET /caminatas`) y usa componentes y utilidades que siguen en el resto del front (`EncabezadoSeccion`, `EstadoDeDatos`, `Forma`, `useFetch`, `utils/caminata.js`, `config/contacto.js`). El panel de administración (pestaña Caminata) y la API no se tocaron.

## Cómo volver a ponerla

1. En `src/pages/HomePage.jsx`: `import { Caminata } from "../exportables/caminata";` y `<Caminata />` entre `<TalleresList />` y `<SobreSara />`.
2. En `src/config/secciones.js`: sumar `{ id: "caminata", nombre: "Caminata" }` entre talleres y sobre Sara, para que vuelva el link de la navbar y del pie.
