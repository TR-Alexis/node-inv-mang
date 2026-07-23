# Inventory Management API

Backend para gestionar productos, stock, usuarios y permisos. El proyecto se construye por módulos con Node.js, Express, TypeScript, PostgreSQL, Prisma, Docker, JWT, roles, Swagger y pruebas.

## Requisitos

- Node.js 20 o superior
- npm
- Docker Desktop (a partir del módulo de PostgreSQL)

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

Los módulos siguientes añadirán PostgreSQL, Prisma, inventario, autenticación JWT, roles, Swagger y pruebas de integración.
