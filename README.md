# Sara Figarra · API

API REST para el sitio de **Sara Figarra**, artista plástica. Alimenta una landing pública (obras, productos y talleres) y un panel de administración desde el que ella carga y edita el contenido.

- **API deployada:** https://proyecto-integrador-adaitw.onrender.com
- **Repositorio:** monorepo con las carpetas `backend/` (esta API) y `frontend/` (React con Vite, en desarrollo).

> Render puede tardar unos segundos en responder la primera vez si la API estuvo inactiva.

## Tecnologías

- Node.js 22 + Express 5 en TypeScript (CommonJS)
- MongoDB Atlas + Mongoose 9
- Zod 4 para validar los datos que llegan
- `bcrypt` y `jsonwebtoken` para la autenticación
- `express-rate-limit`, `helmet` y `cors` para la seguridad
- `morgan` para los logs y `dotenv` para las variables de entorno

## Estructura del backend

```
backend/src/
├── config/        conexión a la base
├── controllers/   lógica de cada ruta
├── middlewares/   auth (JWT), validación, errores y rate limit
├── models/        modelos de Mongoose
├── routes/        rutas por entidad
├── schemas/       esquemas de Zod
├── scripts/       seed para crear la cuenta admin
├── app.ts         arma la app de Express
└── server.ts      conecta la base y levanta el servidor
```

## Instalación y ejecución

Requisitos: Node.js 22 o superior y un cluster de MongoDB Atlas.

```bash
git clone https://github.com/aylenfrisoli/proyecto-integrador-adaitw.git
cd proyecto-integrador-adaitw/backend
npm install
cp .env.example .env     # completá los valores (ver la tabla de abajo)
npm run seed             # crea la cuenta de administradora
npm run dev              # levanta la API en http://localhost:3000
```

### Scripts

| Script          | Qué hace                                              |
| --------------- | ----------------------------------------------------- |
| `npm run dev`   | levanta la API con recarga automática (`tsx watch`)   |
| `npm run build` | compila TypeScript a la carpeta `dist/`               |
| `npm start`     | corre la versión compilada (`dist/server.js`)         |
| `npm run seed`  | crea la cuenta admin; si ya existe, no la duplica     |

### Variables de entorno

| Variable         | Descripción                                                          |
| ---------------- | -------------------------------------------------------------------- |
| `PORT`           | puerto donde escucha la API (Render define el suyo)                  |
| `MONGO_URI`      | URI de conexión a Atlas, con el nombre de la base (`sara-figarra`)   |
| `JWT_SECRET`     | clave para firmar los tokens, larga y difícil de adivinar            |
| `JWT_EXPIRES_IN` | duración de la sesión, por ejemplo `1d`                              |
| `CORS_ORIGIN`    | URL del front que puede consumir la API (en desarrollo, Vite: `http://localhost:5173`) |
| `ADMIN_EMAIL`    | email de la cuenta admin que crea el seed                            |
| `ADMIN_PASSWORD` | contraseña de la cuenta admin que crea el seed                       |

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

La colección está en [`backend/postman/sara-figarra.postman_collection.json`](backend/postman/sara-figarra.postman_collection.json). Tiene 56 requests en 6 carpetas (Auth, Categorías, Obras, Productos, Talleres, y Borrados y limpieza) con casos correctos y de error: `400`, `401`, `404`, `409` y filtros por categoría. Cada request trae sus tests.

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

Corrida completa contra la API local y contra la de Render: 56 requests y 82 aserciones, sin fallos. La colección borra al final todo lo que crea, así la base queda como estaba.

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
- Terminar el frontend (landing pública y panel de administración).
