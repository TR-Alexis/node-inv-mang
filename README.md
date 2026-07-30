# Inventory Management API

Backend para gestionar productos, stock, usuarios y permisos. El proyecto se construye por módulos con Node.js, Express, TypeScript, PostgreSQL, Prisma, Docker, JWT, roles, Swagger y pruebas.

## Requisitos

- Node.js 20 o superior
- npm
- Docker Desktop (a partir del módulo de PostgreSQL)

## Módulo 2: PostgreSQL con Docker

El entorno local de PostgreSQL se define en `docker/docker-compose.yml`.

Configura las variables locales copiando `.env.example` a `.env`:

```powershell
Copy-Item .env.example .env
```

Inicia la base de datos:

```bash
npm run db:up
```

Comprueba que el contenedor esté saludable:

```bash
docker compose -f docker/docker-compose.yml ps
```

La conexión por defecto es:

```text
postgresql://inventory_user:inventory_password@localhost:5432/inventory_db
```

Para detener PostgreSQL sin eliminar los datos:

```bash
npm run db:down
```

Para borrar también el volumen local, únicamente en desarrollo:

```bash
docker compose -f docker/docker-compose.yml down -v
```

Consulta la [guía de PostgreSQL](docker/README.md) para los comandos y advertencias del volumen.

## Módulo 3: Prisma y datos iniciales

El modelo de datos se define en `prisma/schema.prisma` y se sincroniza con PostgreSQL usando Prisma Migrate.

Para generar el cliente Prisma:

```bash
npm run prisma:generate
```

Para aplicar la migración inicial:

```bash
npm run prisma:migrate
```

Para poblar datos de desarrollo con seed:

```bash
npm run db:seed
```

La semilla crea:

- Usuario administrador `admin@example.com`.
- Categoría `General`.
- Producto `SKU-001` en `General`.

La API ya puede leer y escribir datos con Prisma; por ejemplo `GET /api/v1/categories` y `POST /api/v1/categories`.

## Módulo 0: ejecutar la API

Instala las dependencias:

```bash
npm install
```

Crea el archivo de entorno local:

```bash
copy .env.example .env
```

En PowerShell también puedes usar:

```powershell
Copy-Item .env.example .env
```

Inicia el servidor en desarrollo:

```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`.

```text
GET /
Hello Inventory API
```

El router versionado inicial también expone:

```text
GET /api/v1
```

Respuesta:

```json
{
	"data": {
		"name": "Inventory API",
		"version": "v1",
		"status": "ok"
	}
}
```

## Scripts

| Script | Uso |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run typecheck` | Comprueba los tipos sin generar archivos |
| `npm run build` | Compila TypeScript en `dist/` |
| `npm start` | Ejecuta la versión compilada |
| `npm test` | Ejecuta las pruebas |
| `npm run test:watch` | Ejecuta pruebas en modo watch |
| `npm run test:coverage` | Genera el informe de cobertura |
| `npm run db:up` | Inicia PostgreSQL con Docker Compose |
| `npm run db:down` | Detiene PostgreSQL y conserva el volumen |
| `npm run db:logs` | Muestra los logs de PostgreSQL |
| `npm run prisma:generate` | Genera el cliente Prisma |
| `npm run prisma:migrate` | Aplica la migración inicial |
| `npm run db:seed` | Ejecuta el seed de Prisma |

## Arquitectura inicial

La aplicación se divide en tres capas principales:

- `routes`: registra endpoints y conecta middleware con controllers.
- `controllers`: traduce la petición HTTP a una operación de aplicación.
- `services`: contendrá las reglas de negocio.
- `repositories`: contendrá el acceso a PostgreSQL y Prisma.

Los errores se procesan al final del pipeline de Express. Una ruta inexistente devuelve un error JSON con esta forma:

```json
{
	"error": {
		"code": "ROUTE_NOT_FOUND",
		"message": "Route GET /api/v1/unknown not found"
	}
}
```

## Estructura

```text
src/       Código de la API
 tests/    Pruebas automatizadas
 docker/   Configuración Docker de módulos posteriores
 prisma/   Schema y migraciones de módulos posteriores
 docs/     Documentación OpenAPI y guías
```

## Estado del proyecto

El Módulo 0 incluye la aplicación Express, middleware base, configuración TypeScript, scripts npm y el endpoint inicial.

El Módulo 1 añade el router `/api/v1`, la respuesta de estado, el formato común de errores, el middleware de rutas inexistentes y la estructura base para controllers, services, repositories, schemas, configuración y tipos.

El Módulo 2 añade PostgreSQL 16 sobre Docker Compose, volumen persistente, healthcheck, variables de entorno y scripts para iniciar, detener y consultar la base de datos.

El desarrollo progresivo ha avanzado hasta el Módulo 4.

### Módulo 3: estado

El Módulo 3 (Prisma y datos iniciales) está completado: el esquema de datos vive en `prisma/schema.prisma`, las migraciones iniciales se aplicaron y el seed reproducible crea datos de ejemplo (usuario admin, categoría `General`, producto `SKU-001`).

### Módulo 4: CRUD de categorías y productos (completado)

Implementaciones realizadas:

- Endpoints de categorías y productos con validación básica y manejo de errores.
- CRUD completo para `categories` y `products` con control de duplicados y 404s.
- Validaciones de payloads en `src/schemas`.
- Repositorios Prisma en `src/repositories`.
- Pruebas de integración básicas en `tests/categories.test.ts` y `tests/products.test.ts`.
- TypeScript compila sin errores (`npm run typecheck`).

Rutas disponibles (base `http://localhost:3000/api/v1`):

```
GET    /categories
GET    /categories/:id
POST   /categories
PATCH  /categories/:id
DELETE /categories/:id

GET    /products
GET    /products/:id
POST   /products
PATCH  /products/:id
DELETE /products/:id
```

Ejemplo rápido para Postman (crear categoría):

POST http://localhost:3000/api/v1/categories

Body (JSON):

```json
{
	"name": "Nueva categoría"
}
```

Ejecutar todo localmente (secuencialmente):

```bash
npm install
copy .env.example .env
npm run db:up          # inicia PostgreSQL en Docker
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev            # o npm start después de build
```

Ejecutar pruebas:

```bash
npm test
```

### Módulo 5: movimientos de stock (completado)

Se añadió el soporte para registrar movimientos de inventario y actualizar la cantidad de cada producto en una transacción.

Endpoints disponibles:

```
POST /api/v1/products/:id/movements
GET  /api/v1/products/:id/movements
```

Ejemplo para crear un movimiento de entrada:

```http
POST http://localhost:3000/api/v1/products/:id/movements
Content-Type: application/json

{
  "type": "IN",
  "quantity": 4,
  "note": "Reposición inicial"
}
```

Reglas implementadas:

- `IN` incrementa el stock.
- `OUT` decrementa el stock y falla con `400` si no hay cantidad suficiente.
- `ADJUSTMENT` reemplaza la cantidad del producto por el valor enviado.
- Los movimientos se guardan en el historial con su tipo, cantidad, nota y fecha.

Pruebas verificadas:

```bash
npm test -- --runInBand tests/movements.test.ts
```

Próximos pasos planificados: autenticación JWT, autorización por roles y documentación OpenAPI/Swagger.
