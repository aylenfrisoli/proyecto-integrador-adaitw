// carga el .env antes de leer cualquier variable, igual que en server.ts
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
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

// imagen svg de relleno codificada en base64 para usar el mismo formato que el panel
function imagen(ancho: number, alto: number, tono: Tono, texto: string): string {
  const { fondo, texto: colorTexto } = TONOS[tono];
  const textoSeguro = texto.replace(/[&<>"']/g, (caracter) => {
    const entidades: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" };
    return entidades[caracter];
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}"><rect width="100%" height="100%" fill="#${fondo}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#${colorTexto}" font-family="sans-serif" font-size="${Math.max(18, Math.floor(ancho / 18))}">${textoSeguro}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

const CATEGORIAS = ["Pinturas", "Cajas", "Bordados", "Bolsos", "Papelería", "Collages"];

// la categoria se indica por nombre y se cambia por su id al guardar
const OBRAS = [
  {
    titulo: "Textura de sal",
    descripcion: "Cuadro con flores en tonos violetas y gama azul, pintado sobre tela con acrílicos sobre bastidor.",
    imagen: imagen(800, 1000, "arena", "Textura de sal"),
    categoria: "Bordados",
  },
  {
    titulo: "Papeles de verano",
    descripcion: "Cuadro de limones, pintado sobre tela con acrílicos sobre bastidor.",
    imagen: imagen(800, 1000, "ocre", "Papeles de verano"),
    categoria: "Collages",
  },
  {
    titulo: "Formas en diálogo",
    descripcion: "Cuadro collage de mujer sentada mirando hacia la derecha, con mar al frente, isla y bosque en el fondo.",
    imagen: imagen(800, 1000, "salvia", "Formas en diálogo"),
    categoria: "Collages",
  },
  {
    titulo: "Fondo del Mar",
    descripcion: "Cuadro sobre madera con combinación de acrílicos y óleos aplicados con espátula sobre fondo marino.",
    imagen: imagen(800, 1000, "salvia", "Fondo del Mar"),
    categoria: "Pinturas",
  },
  {
    titulo: "Mar de colores",
    descripcion: "Cuadro con cianotipia azul y hojas naturales.",
    imagen: imagen(800, 1000, "arena", "Mar de colores"),
    categoria: "Pinturas",
  },
  {
    titulo: "Jardín abstracto",
    descripcion: "Cuadro vertical de jarrón celeste con gran ramo de flores blancas y centros amarillos, una de las obras más aclamadas de la autora.",
    imagen: imagen(800, 1000, "salvia", "Jardín abstracto"),
    categoria: "Pinturas",
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
    titulo: "Workshop de Resina",
    descripcion: "Decoramos piezas de yeso con resina + buquet de flores. Horario: 15:00 a 17:00 hs.",
    fecha: new Date("2026-10-15T15:00:00-03:00"),
    modalidad: "presencial" as const,
    direccion: "Marano 308, Mar de Ajó",
    estado: "completo" as const,
  },
  {
    titulo: "El encanto de la Cianotipia",
    descripcion: "Técnica de fotografía antigua, convertí luz en arte. Break incluido. Horario: 10:00 a 12:00 hs.",
    fecha: new Date("2026-10-03T10:00:00-03:00"),
    modalidad: "presencial" as const,
    direccion: "Marano 308, Mar de Ajó",
    estado: "completo" as const,
  },
  {
    titulo: "Vino y Pintura",
    descripcion:
      "Espacio para soltar la mente, despertar tu lado artístico mientras disfrutas buena compañía. Usando de referencia cuadro de tallerista, aprenderemos a observar, dibujar y pintar. Horario: 18:00 a 20:00 hs.",
    fecha: new Date("2026-09-19T18:00:00-03:00"),
    modalidad: "presencial" as const,
    direccion: "Marano 308, Mar de Ajó",
    estado: "completo" as const,
  },
  {
    titulo: "Workshop de Texturas",
    descripcion:
      "Bastidor de 30x40 con pintura y espátula. Materiales y merienda incluidos. Horario: 15:00 a 17:00 hs.",
    fecha: new Date("2026-08-15T15:00:00-03:00"),
    modalidad: "presencial" as const,
    direccion: "Marano 308, Mar de Ajó",
    estado: "completo" as const,
  },
];

const TALLERES_RETIRADOS = [
  "Taller de Cianotipia",
  "Iniciación a la Pintura",
  "Taller de Collage Creativo",
];

// crea lo que falta; los talleres de ejemplo se sincronizan por titulo para no duplicarse
async function cargarDemo(): Promise<void> {
  const talleresBorrados = await Taller.deleteMany({
    titulo: { $in: TALLERES_RETIRADOS },
  });
  if (talleresBorrados.deletedCount > 0) {
    console.log(`borrados ${talleresBorrados.deletedCount} talleres retirados`);
  }

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
    const resultado = await Taller.findOneAndUpdate({ titulo: datos.titulo }, datos, {
      upsert: true,
      returnDocument: "after",
      runValidators: true,
      setDefaultsOnInsert: true,
    });
    console.log(`sincronizado taller: ${resultado.titulo}`);
  }
}

// borra solo lo que cargo este seed (por titulo y nombre), no toca lo que sara cargue desde el panel
async function borrarDemo(): Promise<void> {
  const obras = await Obra.deleteMany({ titulo: { $in: OBRAS.map((o) => o.titulo) } });
  const productos = await Producto.deleteMany({ titulo: { $in: PRODUCTOS.map((p) => p.titulo) } });
  const talleres = await Taller.deleteMany({ titulo: { $in: TALLERES.map((t) => t.titulo) } });
  console.log(`borradas ${obras.deletedCount} obras, ${productos.deletedCount} productos y ${talleres.deletedCount} talleres`);

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
