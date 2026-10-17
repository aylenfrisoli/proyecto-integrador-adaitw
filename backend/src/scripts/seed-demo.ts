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

const DIA_EN_MS = 24 * 60 * 60 * 1000;

// imagen de relleno con los colores de la paleta; placehold.co devuelve un png con el texto que le pasemos
function imagen(ancho: number, alto: number, fondo: string, texto: string): string {
  return `https://placehold.co/${ancho}x${alto}/${fondo}/9f7657.png?text=${encodeURIComponent(texto)}`;
}

// fecha futura a partir de hoy, asi los talleres de ejemplo nunca quedan vencidos al correr el seed
function enDias(dias: number): Date {
  return new Date(Date.now() + dias * DIA_EN_MS);
}

const CATEGORIAS = ["Pinturas", "Cajas", "Bordados", "Bolsos", "Papelería", "Collages"];

// la categoria se indica por nombre y se cambia por su id al guardar
const OBRAS = [
  {
    titulo: "Mar de colores",
    descripcion: "Pintura sobre tela con capas de azules y turquesas que imitan el movimiento del mar al amanecer.",
    imagen: imagen(800, 1000, "c4dcff", "Mar de colores"),
    categoria: "Pinturas",
  },
  {
    titulo: "Atardecer en la costa",
    descripcion: "Acrílico con tonos durazno y rosa, pintado a espátula para dar textura al cielo.",
    imagen: imagen(800, 1000, "ffdfbd", "Atardecer en la costa"),
    categoria: "Pinturas",
  },
  {
    titulo: "Jardín abstracto",
    descripcion: "Formas libres y colores vivos inspiradas en las flores del jardín de Sara.",
    imagen: imagen(800, 1000, "f6cbd5", "Jardín abstracto"),
    categoria: "Pinturas",
  },
  {
    titulo: "Formas en diálogo",
    descripcion: "Collage abstracto con papeles recortados a mano que juegan con el equilibrio y el color.",
    imagen: imagen(800, 1000, "ebceff", "Formas en diálogo"),
    categoria: "Collages",
  },
  {
    titulo: "Papeles de verano",
    descripcion: "Collage con papeles teñidos, telas y texturas en tonos cálidos.",
    imagen: imagen(800, 1000, "ffdfbd", "Papeles de verano"),
    categoria: "Collages",
  },
  {
    titulo: "Textura de sal",
    descripcion: "Bordado artesanal sobre lino con hilos de colores que dibujan olas y espuma.",
    imagen: imagen(800, 1000, "c4dcff", "Textura de sal"),
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
    imagen: imagen(800, 800, "f6cbd5", "Caja Abstracto Vivo"),
    disponibilidad: "disponible",
    categoria: "Cajas",
  },
  {
    titulo: "Caja de madera Mar",
    descripcion: "Caja pintada en tonos azules con detalles dorados. Cada una es única.",
    precio: 16000,
    imagen: imagen(800, 800, "c4dcff", "Caja Mar"),
    disponibilidad: "agotado",
    categoria: "Cajas",
  },
  {
    titulo: "Bordado Flores de hilo",
    descripcion: "Bastidor con flores bordadas a mano, hilos de colores y mucha textura.",
    precio: 12000,
    imagen: imagen(800, 800, "ebceff", "Bordado Flores de hilo"),
    mensajeWhatsapp: "Hola Sara! Me gustaría encargar un bordado como el de Flores de hilo.",
    disponibilidad: "por_encargo",
    categoria: "Bordados",
  },
  {
    titulo: "Bolso de tela pintada",
    descripcion: "Bolso práctico y artesanal con tela pintada a mano, de estilo único.",
    // sin precio a proposito: sirve para probar el texto "consultar precio" del front
    imagen: imagen(800, 800, "ffdfbd", "Bolso de tela pintada"),
    disponibilidad: "disponible",
    categoria: "Bolsos",
  },
  {
    titulo: "Bolso bandolera",
    descripcion: "Bandolera de tela con bordado en el frente y correa regulable.",
    precio: 21000,
    imagen: imagen(800, 800, "f6cbd5", "Bolso bandolera"),
    disponibilidad: "disponible",
    categoria: "Bolsos",
  },
  {
    titulo: "Cuaderno ilustrado",
    descripcion: "Cuaderno artesanal con tapa ilustrada y personalizable.",
    precio: 7500,
    imagen: imagen(800, 800, "c4dcff", "Cuaderno ilustrado"),
    disponibilidad: "disponible",
    categoria: "Papelería",
  },
];

const TALLERES = [
  {
    titulo: "Taller de Collage Creativo",
    descripcion: "Encuentro presencial para crear collages con papeles, telas y texturas. No hace falta experiencia previa.",
    fecha: enDias(14),
    modalidad: "presencial" as const,
    // dato de ejemplo: la direccion real la carga sara desde el panel
    direccion: "Av. Costanera 1234 (dirección de ejemplo)",
    estado: "abierto" as const,
  },
  {
    titulo: "Iniciación a la Pintura",
    descripcion: "Un espacio ideal para principiantes: colores, pinceles y técnicas básicas paso a paso.",
    fecha: enDias(30),
    // la modalidad real de este taller todavia no esta definida: virtual en el demo sirve para ver los dos casos
    modalidad: "virtual" as const,
    estado: "abierto" as const,
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
