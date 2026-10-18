// carga el .env antes de leer cualquier variable, igual que en server.ts
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { Caminata } from "../models/caminata.model";
import { Categoria } from "../models/categoria.model";
import { Obra } from "../models/obra.model";
import { Producto, type Disponibilidad } from "../models/producto.model";
import { Taller } from "../models/taller.model";

// datos de ejemplo para ver la landing y el panel con contenido; se reemplazan por los reales de sara
// "npm run seed:demo" los carga y "npm run seed:demo:borrar" los saca

// colores de las imagenes de relleno: los tonos suaves de la paleta de naturaleza de fondo, con el texto en el marron o el musgo que mejor se lee encima
const TONOS = {
  arena: { fondo: "ecdcc4", texto: "5a4634" },
  ocre: { fondo: "f7d9a4", texto: "5a4634" },
  ladrillo: { fondo: "f5c9bb", texto: "5a4634" },
  salvia: { fondo: "cfe3c9", texto: "4d6b4d" },
};

type Tono = keyof typeof TONOS;

// imagen de relleno con los colores de la paleta; placehold.co devuelve un png con el texto que le pasemos
// la fuente con serif (playfair) le da un aire mas de galeria que la letra por defecto
function imagen(ancho: number, alto: number, tono: Tono, texto: string): string {
  const { fondo, texto: colorTexto } = TONOS[tono];
  return `https://placehold.co/${ancho}x${alto}/${fondo}/${colorTexto}.png?text=${encodeURIComponent(texto)}&font=playfair-display`;
}

const CATEGORIAS = ["Pinturas", "Cajas", "Bordados", "Bolsos", "Papelería", "Collages"];

// la categoria se indica por nombre y se cambia por su id al guardar
const OBRAS = [
  {
    titulo: "Mar de colores",
    descripcion: "Pintura sobre tela con capas de azules y turquesas que imitan el movimiento del mar al amanecer.",
    imagen: imagen(800, 1000, "arena", "Mar de colores"),
    categoria: "Pinturas",
  },
  {
    titulo: "Atardecer en la costa",
    descripcion: "Acrílico con tonos durazno y rosa, pintado a espátula para dar textura al cielo.",
    imagen: imagen(800, 1000, "ladrillo", "Atardecer en la costa"),
    categoria: "Pinturas",
  },
  {
    titulo: "Jardín abstracto",
    descripcion: "Formas libres y colores vivos inspiradas en las flores del jardín de Sara.",
    imagen: imagen(800, 1000, "salvia", "Jardín abstracto"),
    categoria: "Pinturas",
  },
  {
    titulo: "Formas en diálogo",
    descripcion: "Collage abstracto con papeles recortados a mano que juegan con el equilibrio y el color.",
    imagen: imagen(800, 1000, "salvia", "Formas en diálogo"),
    categoria: "Collages",
  },
  {
    titulo: "Papeles de verano",
    descripcion: "Collage con papeles teñidos, telas y texturas en tonos cálidos.",
    imagen: imagen(800, 1000, "ocre", "Papeles de verano"),
    categoria: "Collages",
  },
  {
    titulo: "Textura de sal",
    descripcion: "Bordado artesanal sobre lino con hilos de colores que dibujan olas y espuma.",
    imagen: imagen(800, 1000, "arena", "Textura de sal"),
    categoria: "Bordados",
  },
];

const PRODUCTOS: {
  titulo: string;
  descripcion: string;
  precio?: number;
  imagen: string;
  mensajeWhatsapp?: string;
  disponibilidad: Disponibilidad;
  categoria: string;
}[] = [
  {
    titulo: "Caja de madera Abstracto Vivo",
    descripcion: "Caja de madera pintada a mano con diseño abstracto y colores vivos. Ideal para guardar tesoros.",
    precio: 18500,
    imagen: imagen(800, 800, "ocre", "Caja Abstracto Vivo"),
    disponibilidad: "disponible",
    categoria: "Cajas",
  },
  {
    titulo: "Caja de madera Mar",
    descripcion: "Caja pintada en tonos azules con detalles dorados. Cada una es única.",
    precio: 16000,
    imagen: imagen(800, 800, "salvia", "Caja Mar"),
    disponibilidad: "agotado",
    categoria: "Cajas",
  },
  {
    titulo: "Bordado Flores de hilo",
    descripcion: "Bastidor con flores bordadas a mano, hilos de colores y mucha textura.",
    precio: 12000,
    imagen: imagen(800, 800, "ladrillo", "Bordado Flores de hilo"),
    mensajeWhatsapp: "Hola Sara! Me gustaría encargar un bordado como el de Flores de hilo.",
    disponibilidad: "por_encargo",
    categoria: "Bordados",
  },
  {
    titulo: "Bolso de tela pintada",
    descripcion: "Bolso práctico y artesanal con tela pintada a mano, de estilo único.",
    // sin precio a proposito: sirve para probar el texto "consultar precio" del front
    imagen: imagen(800, 800, "ladrillo", "Bolso de tela pintada"),
    disponibilidad: "disponible",
    categoria: "Bolsos",
  },
  {
    titulo: "Bolso bandolera",
    descripcion: "Bandolera de tela con bordado en el frente y correa regulable.",
    precio: 21000,
    imagen: imagen(800, 800, "arena", "Bolso bandolera"),
    disponibilidad: "disponible",
    categoria: "Bolsos",
  },
  {
    titulo: "Cuaderno ilustrado",
    descripcion: "Cuaderno artesanal con tapa ilustrada y personalizable.",
    precio: 7500,
    imagen: imagen(800, 800, "ocre", "Cuaderno ilustrado"),
    disponibilidad: "disponible",
    categoria: "Papelería",
  },
];

// las fechas llevan el offset -03:00 de argentina para que la hora cargada sea la de la web, sin depender de la zona de quien corra el seed
const TALLERES = [
  {
    titulo: "Taller de Collage Creativo",
    descripcion: "Encuentro presencial para crear collages con papeles, telas y texturas. No hace falta experiencia previa.",
    fecha: new Date("2026-10-31T18:00:00-03:00"),
    modalidad: "presencial" as const,
    direccion: "Costanera 1234, San Bernardo del Tuyú",
    estado: "abierto" as const,
  },
  {
    titulo: "Iniciación a la Pintura",
    descripcion: "Un espacio ideal para principiantes: colores, pinceles y técnicas básicas paso a paso.",
    fecha: new Date("2026-11-16T17:00:00-03:00"),
    modalidad: "virtual" as const,
    estado: "abierto" as const,
  },
  {
    titulo: "Taller de Cianotipia",
    descripcion:
      "Taller virtual para descubrir la cianotipia, una técnica antigua que deja imágenes en azul profundo sobre papel o tela. Vemos el proceso paso a paso y creamos nuestras propias imágenes. Horario: de 15 a 17 hs.",
    fecha: new Date("2026-11-20T15:00:00-03:00"),
    modalidad: "virtual" as const,
    estado: "abierto" as const,
  },
  {
    titulo: "Workshop de Texturas",
    descripcion:
      "Workshop presencial para explorar texturas: probamos materiales, relieves y técnicas para darle cuerpo y carácter a nuestras obras. Horario: de 16 a 18:30 hs.",
    fecha: new Date("2026-11-27T16:00:00-03:00"),
    modalidad: "presencial" as const,
    direccion: "Costanera 1234, San Bernardo del Tuyú",
    estado: "abierto" as const,
  },
];

// ediciones de ejemplo de la caminata, con fotos de relleno en los rosas y lilas de la paleta
// las fechas van a mediodia con el offset -03:00, igual que las que carga el panel, para que el dia no se corra
const CAMINATAS = [
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

// crea lo que falte; si ya existe algo con el mismo nombre o titulo no lo toca, asi se puede correr varias veces
async function cargarDemo(): Promise<void> {
  // un mapa nombre -> id para reemplazar el nombre de categoria de cada obra y producto
  const idPorNombre = new Map<string, mongoose.Types.ObjectId>();

  for (const nombre of CATEGORIAS) {
    const existente = await Categoria.findOne({ nombre });
    const categoria = existente ?? (await Categoria.create({ nombre }));
    idPorNombre.set(nombre, categoria._id);
    console.log(`${existente ? "ya existia" : "creada"} categoria: ${nombre}`);
  }

  for (const { categoria, ...datos } of OBRAS) {
    const existente = await Obra.findOne({ titulo: datos.titulo });
    if (existente) {
      console.log(`ya existia obra: ${datos.titulo}`);
      continue;
    }
    await Obra.create({ ...datos, categoria: idPorNombre.get(categoria) });
    console.log(`creada obra: ${datos.titulo}`);
  }

  for (const { categoria, ...datos } of PRODUCTOS) {
    const existente = await Producto.findOne({ titulo: datos.titulo });
    if (existente) {
      console.log(`ya existia producto: ${datos.titulo}`);
      continue;
    }
    await Producto.create({ ...datos, categoria: idPorNombre.get(categoria) });
    console.log(`creado producto: ${datos.titulo}`);
  }

  for (const datos of TALLERES) {
    const existente = await Taller.findOne({ titulo: datos.titulo });
    if (existente) {
      console.log(`ya existia taller: ${datos.titulo}`);
      continue;
    }
    await Taller.create(datos);
    console.log(`creado taller: ${datos.titulo}`);
  }

  // las ediciones de ejemplo solo se cargan si todavia no hay ninguna
  // si sara ya cargo las reales, mezclarlas con las de ejemplo confundiria el sitio
  if (await Caminata.exists({})) {
    console.log("ya hay ediciones de la caminata, no se cargan las de ejemplo");
    return;
  }

  for (const datos of CAMINATAS) {
    await Caminata.create(datos);
    console.log(`creada edicion de la caminata: ${datos.nombre}`);
  }
}

// borra solo lo que cargo este seed (por titulo y nombre), no toca lo que sara cargue desde el panel
async function borrarDemo(): Promise<void> {
  const obras = await Obra.deleteMany({ titulo: { $in: OBRAS.map((o) => o.titulo) } });
  const productos = await Producto.deleteMany({ titulo: { $in: PRODUCTOS.map((p) => p.titulo) } });
  const talleres = await Taller.deleteMany({ titulo: { $in: TALLERES.map((t) => t.titulo) } });
  console.log(`borradas ${obras.deletedCount} obras, ${productos.deletedCount} productos y ${talleres.deletedCount} talleres`);

  // con las ediciones no alcanza el nombre: sara puede llamar "1ª edición" a una real
  // por eso se borran solo las que ademas tienen todas sus fotos de relleno, y una edicion real tiene fotos propias
  const candidatas = await Caminata.find({ nombre: { $in: CAMINATAS.map((c) => c.nombre) } });
  const delDemo = candidatas.filter(
    (c) => c.fotos.length > 0 && c.fotos.every((foto) => foto.url.startsWith("https://placehold.co/")),
  );
  await Caminata.deleteMany({ _id: { $in: delDemo.map((c) => c._id) } });
  console.log(`borradas ${delDemo.length} ediciones de la caminata (se conservan ${candidatas.length - delDemo.length} con fotos propias)`);

  for (const nombre of CATEGORIAS) {
    const categoria = await Categoria.findOne({ nombre });
    if (!categoria) continue;

    // la api no deja borrar una categoria con obras o productos, aca se respeta la misma regla
    const enUso =
      (await Obra.exists({ categoria: categoria._id })) ||
      (await Producto.exists({ categoria: categoria._id }));
    if (enUso) {
      console.log(`se conserva la categoria ${nombre}: tiene obras o productos que no son del demo`);
      continue;
    }

    await categoria.deleteOne();
    console.log(`borrada categoria: ${nombre}`);
  }
}

async function main(): Promise<void> {
  await connectDB();

  // el unico argumento posible es "borrar"; sin argumento se cargan los datos
  if (process.argv[2] === "borrar") {
    await borrarDemo();
  } else {
    await cargarDemo();
  }
}

main()
  .catch((error) => {
    console.error("fallo el seed demo:", error);
    // codigo distinto de 0 para que quede claro que el script termino mal
    process.exitCode = 1;
  })
  // se cierra la conexion pase lo que pase, si no el proceso queda colgado esperando
  .finally(() => mongoose.disconnect());
