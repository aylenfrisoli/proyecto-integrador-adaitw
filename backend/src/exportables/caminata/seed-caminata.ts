import { Caminata } from "./caminata.model";

// funcion que arma una imagen de relleno; es la misma "imagen" de scripts/seed-demo.ts y se recibe por parametro para no duplicarla
type ArmarImagen = (ancho: number, alto: number, tono: "arena" | "ocre" | "ladrillo" | "salvia", texto: string) => string;

// ediciones de ejemplo de la caminata, con fotos de relleno
// las fechas van a mediodia con el offset -03:00, igual que las que carga el panel, para que el dia no se corra
function armarEdiciones(imagen: ArmarImagen) {
  return [
    {
      nombre: "1ª edición",
      fecha: new Date("2026-03-14T12:00:00-03:00"),
      lugar: "San Bernardo del Tuyú",
      descripcion: "Primera caminata de concientización sobre el cáncer de mama: salimos a recorrer la costa para visibilizar y acompañarnos entre todos.",
      fotos: [
        { url: imagen(600, 600, "ladrillo", "La salida"), epigrafe: "La salida" },
        { url: imagen(600, 600, "salvia", "En camino"), epigrafe: "Caminando juntos" },
        // sin epigrafe a proposito: sirve para ver como queda una polaroid sin texto
        { url: imagen(600, 600, "arena", "Llegada") },
      ],
    },
    {
      nombre: "2ª edición",
      fecha: new Date("2026-05-16T12:00:00-03:00"),
      lugar: "San Bernardo del Tuyú",
      descripcion: "Segunda caminata: más personas, más lazos y la misma ilusión de seguir juntos.",
      fotos: [
        { url: imagen(600, 600, "ocre", "Largada"), epigrafe: "La largada" },
        { url: imagen(600, 600, "ladrillo", "Todas juntas"), epigrafe: "Todas juntas" },
        { url: imagen(600, 600, "salvia", "Un abrazo"), epigrafe: "Un abrazo en la meta" },
      ],
    },
    {
      nombre: "3ª edición",
      fecha: new Date("2026-08-22T12:00:00-03:00"),
      lugar: "San Bernardo del Tuyú",
      descripcion: "Tercera caminata del año, la más grande hasta ahora. Gracias a cada persona que vino a caminar.",
      fotos: [
        { url: imagen(600, 600, "arena", "Llegando"), epigrafe: "Llegando a la meta" },
        { url: imagen(600, 600, "ladrillo", "Mariposas"), epigrafe: "Mariposas rosas" },
        { url: imagen(600, 600, "ocre", "Sonrisas"), epigrafe: "Sonrisas por todos lados" },
        { url: imagen(600, 600, "salvia", "El cierre") },
      ],
    },
  ];
}

// carga las ediciones de ejemplo solo si todavia no hay ninguna
// si sara ya cargo las reales, mezclarlas con las de ejemplo confundiria el sitio
export async function cargarCaminatasDemo(imagen: ArmarImagen): Promise<void> {
  if (await Caminata.exists({})) {
    console.log("ya hay ediciones de la caminata, no se cargan las de ejemplo");
    return;
  }

  for (const datos of armarEdiciones(imagen)) {
    await Caminata.create(datos);
    console.log(`creada edicion de la caminata: ${datos.nombre}`);
  }
}

// borra solo las ediciones de ejemplo
// con las ediciones no alcanza el nombre: sara puede llamar "1ª edición" a una real
// por eso se borran solo las que ademas tienen todas sus fotos de relleno, y una edicion real tiene fotos propias
export async function borrarCaminatasDemo(imagen: ArmarImagen): Promise<void> {
  const ediciones = armarEdiciones(imagen);
  const imagenesDemo = ediciones.flatMap((edicion) => edicion.fotos.map((foto) => foto.url));

  const candidatas = await Caminata.find({ nombre: { $in: ediciones.map((edicion) => edicion.nombre) } });
  const delDemo = candidatas.filter(
    (edicion) =>
      edicion.fotos.length > 0 &&
      edicion.fotos.every((foto) => foto.url.startsWith("https://placehold.co/") || imagenesDemo.includes(foto.url)),
  );
  await Caminata.deleteMany({ _id: { $in: delDemo.map((edicion) => edicion._id) } });
  console.log(`borradas ${delDemo.length} ediciones de la caminata (se conservan ${candidatas.length - delDemo.length} con fotos propias)`);
}
