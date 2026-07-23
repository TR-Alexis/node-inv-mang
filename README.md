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

## Estructura

```text
src/       Código de la API
 tests/    Pruebas automatizadas
 docker/   Configuración Docker de módulos posteriores
 prisma/   Schema y migraciones de módulos posteriores
 docs/     Documentación OpenAPI y guías
```

## Estado del proyecto

El Módulo 0 incluye la aplicación Express, middleware base, configuración TypeScript, scripts npm y el endpoint inicial. Los módulos siguientes añadirán PostgreSQL, Prisma, inventario, autenticación JWT, roles, Swagger y pruebas de integración.
