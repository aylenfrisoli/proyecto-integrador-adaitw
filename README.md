# Sara Figarra · Landing, panel y API

Sitio de **Sara Figarra** (SAF Creaciones para Vos), artista plástica: una landing pública con sus obras, productos, talleres y las ediciones de la caminata de concientización sobre el cáncer de mama que organiza, y un panel de administración desde el que ella carga y edita el contenido.

- **API deployada:** https://proyecto-integrador-adaitw.onrender.com
- **Repositorio:** monorepo con las carpetas `backend/` (API REST con Express y MongoDB) y `frontend/` (React con Vite).

> Render puede tardar unos segundos en responder la primera vez si la API estuvo inactiva.

## Tecnologías

**Backend**

- Node.js 22 + Express 5 en TypeScript (CommonJS)
- MongoDB Atlas + Mongoose 9
- Zod 4 para validar los datos que llegan
- `bcrypt` y `jsonwebtoken` para la autenticación
- `express-rate-limit`, `helmet` y `cors` para la seguridad
- `morgan` para los logs y `dotenv` para las variables de entorno

**Frontend**

- React 19 con Vite, en JavaScript
- `react-router-dom` 6 para las rutas
- Módulos CSS para los estilos de cada componente y un `index.css` global con los colores y tipografías
- `react-icons` para los íconos
- Context API para la sesión y custom hooks (`useFetch`, `useApi`, `useAccion`) para hablar con la API

## Cómo levantar el proyecto

Requisitos: Node.js 22 o superior, Git y un cluster de MongoDB Atlas (el plan gratuito alcanza).

Se necesitan **dos terminales**: una para el backend y otra para el frontend.

### Paso 1: clonar el repositorio

```bash
git clone https://github.com/aylenfrisoli/proyecto-integrador-adaitw.git
cd proyecto-integrador-adaitw
```

### Paso 2: levantar el backend (terminal 1)

```bash
cd backend
npm install
cp .env.example .env     # abrí el .env y completá los valores (ver la tabla de variables)
npm run seed             # crea la cuenta de administradora con el email y la contraseña del .env
npm run seed:demo        # opcional: carga obras, productos, talleres y ediciones de la caminata de ejemplo
npm run dev              # levanta la API en http://localhost:3000
```

Para saber si anduvo, abrí http://localhost:3000 en el navegador: tiene que responder sin errores.

### Paso 3: levantar el frontend (terminal 2)

```bash
cd frontend
npm install
cp .env.example .env     # trae VITE_API_URL=http://localhost:3000, que ya sirve para desarrollo
npm run dev              # levanta el sitio en http://localhost:5173
```

### Paso 4: usar el sitio

- **Landing pública:** http://localhost:5173
- **Panel de administración:** entrá a http://localhost:5173/login con el `ADMIN_EMAIL` y el `ADMIN_PASSWORD` que pusiste en el `.env` del backend.

### Si algo no anda

- **El navegador muestra un error de CORS o la landing dice que no hay conexión:** `CORS_ORIGIN` del backend tiene que ser exactamente la URL del front (`http://localhost:5173`). Si Vite abrió otro puerto, cambiá `CORS_ORIGIN` y reiniciá el backend.
- **El login responde "demasiados intentos":** después de 5 intentos fallidos hay que esperar 15 minutos.
- **El backend no arranca y avisa que falta una variable:** revisá que el `.env` tenga todos los valores de la tabla de abajo.

### Scripts del backend

| Script                   | Qué hace                                                                        |
| ------------------------ | ------------------------------------------------------------------------------- |
| `npm run dev`            | levanta la API con recarga automática (`tsx watch`)                             |
| `npm run build`          | compila TypeScript a la carpeta `dist/`                                         |
| `npm start`              | corre la versión compilada (`dist/server.js`)                                   |
| `npm run seed`           | crea la cuenta admin; si ya existe, no la duplica                               |
| `npm run seed:demo`      | carga categorías, obras, productos, talleres y ediciones de la caminata de ejemplo con imágenes de relleno |
| `npm run seed:demo:borrar` | borra solo los datos que cargó el seed demo, sin tocar lo cargado desde el panel |

El seed demo escribe en la base que indique `MONGO_URI`, así que si apunta a Atlas también se ve en la API deployada. Los datos de ejemplo quedan cargados en producción hasta que Sara suba su contenido real; entonces se sacan con `seed:demo:borrar`, que no toca lo que ella cargue desde el panel.

Con la caminata el seed es más cuidadoso: las ediciones de ejemplo solo se cargan si todavía no hay ninguna, y `seed:demo:borrar` solo borra las que tienen todas las fotos de relleno, así que nunca toca las ediciones reales.

### Variables de entorno

| Variable         | Descripción                                                          |
| ---------------- | -------------------------------------------------------------------- |
| `PORT`           | puerto donde escucha la API (Render define el suyo)                  |
| `MONGO_URI`      | URI de conexión a Atlas, con el nombre de la base (`sara-figarra`)   |
| `JWT_SECRET`     | clave para firmar los tokens, larga y difícil de adivinar            |
| `JWT_EXPIRES_IN` | duración de la sesión, por ejemplo `1d`                              |
| `CORS_ORIGIN`    | URL del front que puede consumir la API (en desarrollo, Vite: `http://localhost:5173`; en producción, la del front deployado) |
| `ADMIN_EMAIL`    | email de la cuenta admin que crea el seed                            |
| `ADMIN_PASSWORD` | contraseña de la cuenta admin que crea el seed                       |

### Scripts del frontend

| Script            | Qué hace                                              |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | levanta el sitio con recarga automática (Vite)        |
| `npm run build`   | genera la versión de producción en `frontend/dist/`   |
| `npm run preview` | sirve la versión compilada para probarla              |

### Variable de entorno del frontend

| Variable       | Descripción                                                                     |
| -------------- | ------------------------------------------------------------------------------- |
| `VITE_API_URL` | URL de la API (`http://localhost:3000` en desarrollo, la de Render en producción) |

## Estructura del backend

```
backend/src/
├── config/        conexión a la base
├── controllers/   lógica de cada ruta
├── middlewares/   auth (JWT), validación, errores y rate limit
├── models/        modelos de Mongoose
├── routes/        rutas por entidad
├── schemas/       esquemas de Zod
├── scripts/       seed de la cuenta admin y seed demo con datos de ejemplo
├── app.ts         arma la app de Express
└── server.ts      conecta la base y levanta el servidor
```

## Estructura del frontend

```
frontend/src/
├── components/    piezas de la landing (Hero, tarjetas, listas) y del panel (formularios y listas de administración)
├── config/        URL de la API, secciones de la navbar y datos de contacto (WhatsApp y redes)
├── context/       AuthContext: guarda la sesión de la administradora
├── hooks/         useFetch (leer datos), useApi (escribir con el token) y useAccion (estado de cada acción)
├── pages/         HomePage, LoginPage, AdminPage y NotFoundPage
├── utils/         funciones puras para formatear precios y fechas, filtrar y leer el token
├── App.jsx        define las rutas
└── main.jsx       punto de entrada
```

### Rutas del frontend

| Ruta                  | Acceso    | Qué muestra                                                  |
| --------------------- | --------- | ------------------------------------------------------------ |
| `/`                   | público   | landing con obras, productos, talleres, la caminata y la sección sobre Sara |
| `/login`              | público   | formulario de ingreso de la administradora                   |
| `/admin/:seccion`     | con sesión | panel con las pestañas `categorias`, `obras`, `productos`, `talleres` y `caminata` |
| cualquier otra ruta   | público   | página 404                                                   |

`/admin` redirige a `/admin/categorias`. Si alguien entra al panel sin sesión, lo manda al login; si el token vence, cierra la sesión solo.

## Autenticación

Hay una sola cuenta de administradora, creada con `npm run seed`. **No existe registro público.**

- Las lecturas (`GET`) son públicas, porque la landing las usa sin sesión.
- Las escrituras (`POST`, `PUT` y `DELETE`) requieren un token. Se obtiene con el login y se manda en cada pedido:

```
Authorization: Bearer <token>
```

## Endpoints

### Auth

| Método | Ruta          | Acceso  | Descripción                                |
| ------ | ------------- | ------- | ------------------------------------------ |
| POST   | `/auth/login` | público | devuelve un token JWT y los datos de la admin |

```json
// body
{ "email": "admin@ejemplo.com", "password": "tu_password" }

// respuesta 200
{ "token": "eyJhbGciOi...", "usuario": { "id": "...", "nombre": "...", "email": "..." } }
```

Credenciales incorrectas responden `401` con el mismo mensaje, exista o no el email. Después de 5 intentos fallidos desde la misma IP, la API responde `429` durante 15 minutos.

### Categorías

| Método | Ruta              | Acceso  | Descripción                                              |
| ------ | ----------------- | ------- | -------------------------------------------------------- |
| GET    | `/categorias`     | público | lista todas las categorías                               |
| GET    | `/categorias/:id` | público | trae una categoría                                       |
| POST   | `/categorias`     | admin   | crea una categoría                                       |
| PUT    | `/categorias/:id` | admin   | edita una categoría                                      |
| DELETE | `/categorias/:id` | admin   | borra una categoría (`409` si tiene obras o productos)   |

```json
{ "nombre": "Óleo" }
```

### Obras

| Método | Ruta         | Acceso  | Descripción                                               |
| ------ | ------------ | ------- | --------------------------------------------------------- |
| GET    | `/obras`     | público | lista las obras; acepta `?categoria=<id>` para filtrar    |
| GET    | `/obras/:id` | público | trae una obra                                             |
| POST   | `/obras`     | admin   | crea una obra                                             |
| PUT    | `/obras/:id` | admin   | edita una obra                                            |
| DELETE | `/obras/:id` | admin   | borra una obra                                            |

```json
{
  "titulo": "Atardecer",
  "descripcion": "Óleo sobre tela, 60 x 80 cm",
  "imagen": "https://ejemplo.com/atardecer.jpg",
  "categoria": "<id de una categoría existente>"
}
```

### Productos

| Método | Ruta             | Acceso  | Descripción                                                  |
| ------ | ---------------- | ------- | ------------------------------------------------------------ |
| GET    | `/productos`     | público | lista los productos; acepta `?categoria=<id>` para filtrar   |
| GET    | `/productos/:id` | público | trae un producto                                             |
| POST   | `/productos`     | admin   | crea un producto                                             |
| PUT    | `/productos/:id` | admin   | edita un producto                                            |
| DELETE | `/productos/:id` | admin   | borra un producto                                            |

```json
{
  "titulo": "Print Atardecer",
  "descripcion": "Impresión de edición limitada",
  "precio": 15000,
  "imagen": "https://ejemplo.com/print.jpg",
  "mensajeWhatsapp": "Hola Sara, me interesa el print Atardecer",
  "disponibilidad": "disponible",
  "categoria": "<id de una categoría existente>"
}
```

- `precio`, `mensajeWhatsapp` y `disponibilidad` son opcionales. Sin precio, el front muestra "Consultar precio". Al editar, `"precio": null` borra el precio guardado.
- `disponibilidad` acepta `disponible` (valor por defecto), `agotado` o `por_encargo`.

### Talleres

| Método | Ruta            | Acceso  | Descripción                                          |
| ------ | --------------- | ------- | ---------------------------------------------------- |
| GET    | `/talleres`     | público | lista los talleres, el de fecha más nueva primero    |
| GET    | `/talleres/:id` | público | trae un taller                                       |
| POST   | `/talleres`     | admin   | crea un taller                                       |
| PUT    | `/talleres/:id` | admin   | edita un taller                                      |
| DELETE | `/talleres/:id` | admin   | borra un taller                                      |

```json
{
  "titulo": "Taller de acuarela",
  "descripcion": "Introducción a la acuarela",
  "fecha": "2026-11-20T18:00:00.000Z",
  "modalidad": "presencial",
  "direccion": "Calle Falsa 123",
  "estado": "abierto"
}
```

- `fecha` se manda como texto en formato ISO.
- `modalidad` acepta `presencial` o `virtual`. La `direccion` es obligatoria en los presenciales; en los virtuales no se guarda.
- `estado` acepta `abierto` (valor por defecto), `completo` o `finalizado`.

### Caminatas

Cada documento es una edición de la caminata de concientización sobre el cáncer de mama (1ª edición, 2ª edición...). Las fotos viven dentro de la edición, no tienen rutas propias.

| Método | Ruta              | Acceso  | Descripción                                                    |
| ------ | ----------------- | ------- | -------------------------------------------------------------- |
| GET    | `/caminatas`      | público | lista las ediciones, de la más vieja a la más nueva            |
| GET    | `/caminatas/:id`  | público | trae una edición                                               |
| POST   | `/caminatas`      | admin   | crea una edición                                               |
| PUT    | `/caminatas/:id`  | admin   | edita una edición                                              |
| DELETE | `/caminatas/:id`  | admin   | borra una edición con todas sus fotos                          |

```json
{
  "nombre": "1ª edición",
  "fecha": "2026-03-14T12:00:00-03:00",
  "lugar": "San Bernardo del Tuyú",
  "descripcion": "Primera caminata de concientización sobre el cáncer de mama",
  "fotos": [
    { "url": "https://ejemplo.com/salida.jpg", "epigrafe": "La salida" },
    { "url": "https://ejemplo.com/llegada.jpg" }
  ]
}
```

- `nombre` es la etiqueta del botón de cada edición en la landing (hasta 60 caracteres). `lugar` admite hasta 150 y `descripcion` hasta 1000.
- `fecha` se manda como texto en formato ISO. El panel manda mediodía con offset `-03:00` para que el día no se corra en Argentina.
- `fotos` es opcional y acepta hasta 30 fotos. Cada una lleva la `url` de un link directo a la imagen (solo `http` y `https`) y un `epigrafe` opcional de hasta 120 caracteres, que se ve debajo de la polaroid.
- Al editar, si el body no trae `fotos` se conservan las que ya tenía; si las trae, reemplazan la lista entera (con `"fotos": []` se vacía).

## Respuestas y errores

Todas las respuestas son JSON. Los errores tienen siempre un campo `message`; los de validación suman la lista de campos con problemas:

```json
{
  "message": "los datos enviados no son validos",
  "errores": [{ "campo": "direccion", "mensaje": "la direccion es obligatoria en los talleres presenciales" }]
}
```

| Código | Cuándo                                                                       |
| ------ | ---------------------------------------------------------------------------- |
| 200    | lectura, edición o borrado correctos                                         |
| 201    | recurso creado                                                               |
| 400    | datos inválidos, id mal formado, JSON roto o categoría que no existe         |
| 401    | falta el token, es inválido, venció, o las credenciales del login son erróneas |
| 404    | el recurso o la ruta no existe                                               |
| 409    | se intenta borrar una categoría que tiene obras o productos                  |
| 429    | demasiados intentos fallidos de login                                        |
| 500    | error interno (no se devuelven detalles al cliente)                          |

## Pruebas con Postman

La colección está en [`backend/postman/sara-figarra.postman_collection.json`](backend/postman/sara-figarra.postman_collection.json). Tiene 77 requests en 7 carpetas (Auth, Categorías, Obras, Productos, Talleres, Caminatas, y Borrados y limpieza) con casos correctos y de error: `400`, `401`, `404`, `409` y filtros por categoría. Cada request trae sus tests.

### Cómo usarla

1. En Postman: **Import** y elegí el archivo de la colección.
2. Abrí la colección, pestaña **Variables**, y completá `adminEmail` y `adminPassword` en la columna **Current value** (van vacías para no subir credenciales al repo).
3. Clic derecho en la colección, **Run collection** y **Run**. Tiene que correr completa y en orden: el login guarda el token y cada request usa los ids que creó el anterior.

| Variable        | Para qué sirve                                                                 |
| --------------- | ------------------------------------------------------------------------------ |
| `baseUrl`       | dirección de la API; viene con la de Render y en local se cambia a `http://localhost:3000` |
| `adminEmail`    | email de la cuenta admin                                                       |
| `adminPassword` | contraseña de la cuenta admin                                                  |
| `token`         | lo completa solo el login, no hay que tocarlo                                  |

### Resultado esperado

Corrida completa contra la API local: 77 requests y 123 aserciones, sin fallos. La colección borra al final todo lo que crea, así la base queda como estaba.

### Ojo

- El login tiene rate limit (5 intentos fallidos cada 15 minutos por IP) y la colección hace 2 logins fallidos a propósito. Si se corre 3 veces seguidas, el login responde `429`: esperá 15 minutos.
- Si `baseUrl` apunta a Render, la colección escribe en la base real mientras corre.

## Seguridad

- Contraseña hasheada con `bcrypt`; el login responde igual si el email no existe, para no revelar qué cuentas hay, y compara siempre contra un hash para evitar timing attacks.
- Sesión con JWT; las escrituras verifican el token antes de analizar el body.
- Rate limit en el login contra ataques de fuerza bruta.
- Validación de todos los datos de entrada con Zod, incluidas las URLs de imágenes (solo `http` y `https`).
- Headers de seguridad con `helmet` y `cors` restringido al front configurado.

## Mejoras a futuro

- Subir las imágenes desde el panel en lugar de pegar la URL.
- Reemplazar el número de WhatsApp de ejemplo por el real en `frontend/src/config/contacto.js`.
