# Plan del proyecto: Inventory Management API

## 1. Objetivo

Construir una API backend para administrar productos, categorías, existencias, movimientos de inventario, usuarios y permisos.

El proyecto servirá para aprender y aplicar:

- Node.js y Express.
- TypeScript.
- PostgreSQL.
- Prisma ORM.
- Docker.
- Autenticación con JWT.
- Autorización basada en roles.
- Documentación con Swagger/OpenAPI.
- Pruebas unitarias y de integración.
- Buenas prácticas de preparación para producción.

La aplicación se desarrollará de forma incremental. Cada módulo debe dejar una funcionalidad ejecutable y comprobada antes de comenzar el siguiente.

## 2. Estado actual

Los Módulos 0, 1 y 2 están completados. La API ya incluye:

- Proyecto npm.
- Express y middleware base.
- TypeScript con configuración estricta.
- `dotenv`, `helmet`, `cors`, `compression` y `morgan`.
- Scripts de desarrollo, compilación, ejecución y pruebas.
- Endpoint `GET /`.
- Prueba automatizada con Jest y Supertest.
- Estructura inicial para `src`, `tests`, `docker`, `prisma` y `docs`.
- Router versionado en `/api/v1`.
- Respuesta de estado de la API.
- Middleware centralizado para rutas inexistentes y errores.
- Formato JSON común para errores.
- Estructura inicial de controllers, services, repositories, schemas, configuración y tipos.
- PostgreSQL 16 mediante Docker Compose.
- Volumen persistente para desarrollo local.
- Healthcheck de PostgreSQL.
- Variables de conexión y scripts `db:up`, `db:down` y `db:logs`.
- Modelo Prisma definido en `prisma/schema.prisma`.
- Cliente Prisma singleton en `src/lib/prisma.ts`.
- Migración inicial aplicada.
- Seed reproducible con usuario admin, categoría y producto.

La respuesta inicial de la API es:

```text
Hello Inventory API
```

## 3. Estructura prevista

```text
inventory-management/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── lib/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── types/
│   ├── app.ts
│   └── server.ts
├── tests/
├── docker/
├── prisma/
├── docs/
├── dist/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 4. Módulos de construcción

### Módulo 0: Preparación del proyecto

**Objetivo:** crear una API Express mínima, compilable y testeable.

**Entregables:**

- Configuración de npm y TypeScript.
- Dependencias base de Express.
- Scripts `dev`, `build`, `start`, `typecheck`, `test` y `test:coverage`.
- Separación entre `src/app.ts` y `src/server.ts`.
- Middleware de seguridad, CORS, compresión y logging.
- Endpoint `GET /`.
- Prueba de humo HTTP.
- Variables de entorno iniciales.

**Criterios de terminado:**

- `npm run typecheck` pasa.
- `npm run build` genera `dist`.
- `npm test` pasa.
- `GET /` responde con estado `200` y `Hello Inventory API`.

### Módulo 1: Arquitectura de Express

**Objetivo:** separar responsabilidades y preparar la API para crecer.

**Construcción:**

- Router principal `/api/v1`.
- Carpetas para routes, controllers, services y repositories.
- Middleware centralizado de errores.
- Respuesta consistente para rutas inexistentes.
- Formato estándar para errores y respuestas JSON.
- Tipos compartidos para peticiones y respuestas.

**Criterios de terminado:**

- Las rutas usan versionado.
- Los controllers coordinan, pero no contienen reglas de negocio complejas.
- Los errores controlados llegan a un único middleware.
- Una ruta inexistente devuelve un error JSON documentado.

**Estado:** completado.

### Módulo 2: PostgreSQL y Docker

**Objetivo:** ejecutar una base de datos local reproducible.

**Construcción:**

- `docker/docker-compose.yml`.
- Servicio PostgreSQL.
- Variables para usuario, contraseña, base de datos y puerto.
- Volumen persistente para desarrollo.
- Healthcheck.
- Configuración de `DATABASE_URL`.

**Temas:**

- Imágenes y contenedores.
- Puertos y redes.
- Volúmenes.
- Persistencia.
- Diferencias entre desarrollo y producción.

**Criterios de terminado:**

- `docker compose up -d` inicia PostgreSQL.
- El contenedor informa un estado saludable.
- La configuración `DATABASE_URL` queda documentada para la integración de Prisma del Módulo 3.

**Estado:** completado.

### Módulo 3: Prisma y modelo de datos

**Objetivo:** modelar el dominio del inventario y gestionar cambios de esquema.

**Modelos iniciales:**

- `User`.
- `Category`.
- `Product`.
- `StockMovement`.

**Construcción:**

- `prisma/schema.prisma`.
- Relaciones entre usuarios, categorías y productos.
- SKU único.
- Índices para búsquedas frecuentes.
- Timestamps.
- Migración inicial.
- Cliente Prisma singleton.
- Seed reproducible.
- Endpoint `GET /api/v1/categories`.
- Endpoint `POST /api/v1/categories`.

**Criterios de terminado:**

- Las migraciones se ejecutan desde cero.
- El seed crea datos de desarrollo.
- Las restricciones de la base de datos evitan datos inválidos.
- La API puede leer y escribir mediante Prisma.
- Las rutas de categorías funcionan con datos reales.

**Estado:** completado.

### Módulo 4: CRUD de categorías y productos

**Objetivo:** implementar la gestión principal del inventario.

**Endpoints previstos:**

```text
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id

GET    /api/v1/categories
GET    /api/v1/categories/:id
POST   /api/v1/categories
PATCH  /api/v1/categories/:id
DELETE /api/v1/categories/:id
```

**Funcionalidades:**

- Validación de body, params y query.
- Paginación.
- Búsqueda por nombre o SKU.
- Filtros por categoría y estado.
- Ordenamiento controlado.
- Manejo de SKU duplicado.
- Manejo de recursos inexistentes.

**Criterios de terminado:**

- CRUD completo probado.
- Validaciones devuelven errores claros.
- La paginación tiene un contrato estable.
- Las consultas no aceptan campos arbitrarios para ordenar o filtrar.

### Módulo 5: Movimientos y control de stock

**Objetivo:** mantener existencias consistentes y auditables.

**Endpoints implementados:**

```text
POST /api/v1/products/:id/movements
GET  /api/v1/products/:id/movements
```

**Tipos de movimiento:**

- `IN`: entrada.
- `OUT`: salida.
- `ADJUSTMENT`: ajuste autorizado.

**Reglas:**

- Cada movimiento se registra.
- La actualización del stock y el movimiento ocurren en una transacción.
- No se permite stock negativo.
- Un fallo revierte la operación completa.
- El historial conserva quién realizó el cambio y cuándo.

**Criterios de terminado:**

- Las entradas incrementan el stock.
- Las salidas decrementan el stock.
- El stock insuficiente produce un error controlado.
- El stock y el historial permanecen sincronizados.
- Existe una prueba de rollback.

**Estado:** completado.

### Módulo 6: Autenticación con JWT

**Objetivo:** identificar usuarios y proteger los endpoints.

**Endpoints previstos:**

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

**Construcción:**

- Hash seguro de contraseñas con `bcrypt` o `argon2`.
- Emisión de JWT.
- Expiración configurable.
- Middleware `authenticate`.
- Tipado de `req.user`.
- Rechazo de tokens ausentes, inválidos o expirados.
- Exclusión de contraseñas y secretos de las respuestas y logs.

**Criterios de terminado:**

- Registro y login funcionan.
- Una ruta protegida requiere Bearer token.
- Los tokens inválidos o expirados devuelven `401`.
- Nunca se devuelve la contraseña almacenada.

### Módulo 7: Roles y autorización

**Objetivo:** controlar las acciones permitidas para cada usuario.

**Roles iniciales:**

- `ADMIN`: acceso completo.
- `MANAGER`: gestión de productos y movimientos.
- `VIEWER`: sólo lectura.

**Matriz inicial:**

| Acción | ADMIN | MANAGER | VIEWER |
| --- | --- | --- | --- |
| Consultar productos | Sí | Sí | Sí |
| Crear productos | Sí | Sí | No |
| Editar productos | Sí | Sí | No |
| Eliminar productos | Sí | No | No |
| Crear movimientos | Sí | Sí | No |
| Gestionar usuarios | Sí | No | No |

**Construcción:**

- Middleware `authorize(...roles)`.
- Protección de rutas sensibles.
- Respuestas diferenciadas `401` y `403`.
- Documentación de permisos.

**Criterios de terminado:**

- Un usuario no autenticado recibe `401`.
- Un usuario autenticado sin permiso recibe `403`.
- Cada endpoint sensible tiene una regla de autorización explícita.

### Módulo 8: Swagger y OpenAPI

**Objetivo:** documentar el contrato de la API y facilitar su exploración.

**Construcción:**

- Especificación OpenAPI versionada.
- Swagger UI en `/api/docs`.
- Esquemas de request y response.
- Parámetros de paginación y filtros.
- Errores documentados.
- Autenticación Bearer JWT.
- Ejemplos de peticiones y respuestas.

**Criterios de terminado:**

- Swagger UI carga correctamente.
- El botón de autorización permite probar rutas protegidas.
- La documentación coincide con las respuestas reales.

### Módulo 9: Pruebas

**Objetivo:** comprobar comportamiento, reglas de negocio y contratos HTTP.

**Tipos de pruebas:**

- Unitarias para services.
- Integración para rutas.
- Autenticación y autorización.
- Validación de entrada.
- CRUD.
- Movimientos de stock.
- Errores y restricciones.
- Contratos de respuesta.

**Construcción:**

- Base de datos de test aislada.
- Migraciones reproducibles.
- Seed de pruebas.
- Helpers para autenticación y limpieza.
- Informe de cobertura.

**Criterios de terminado:**

- Los flujos críticos tienen pruebas.
- Las pruebas no dependen de un servidor manual ejecutándose.
- La base de datos de test no usa datos de desarrollo.
- `npm test` y `npm run test:coverage` son reproducibles.

### Módulo 10: Preparación para producción

**Objetivo:** endurecer la aplicación y preparar su entrega.

**Construcción:**

- Dockerfile multi-stage.
- Usuario no root.
- Healthcheck de aplicación y base de datos.
- Graceful shutdown para HTTP y Prisma.
- Timeouts.
- Límite de tamaño de payload.
- Rate limiting.
- CORS configurable por entorno.
- Logs estructurados.
- Protección de secretos.
- Migraciones de despliegue.
- Backups y estrategia de rollback.
- CI para typecheck, build, tests y vulnerabilidades.

**Criterios de terminado:**

- La imagen se construye de forma reproducible.
- La aplicación arranca con configuración externa.
- `/health` refleja el estado real de las dependencias.
- El apagado libera conexiones correctamente.
- Los logs no contienen contraseñas, tokens ni secretos.

## 5. Guías finales

Al finalizar los módulos se crearán estas guías dentro de `docs/` y se enlazarán desde el `README.md`:

1. **Instalación y requisitos**: Node.js, npm, Docker, variables de entorno y primeros comandos.
2. **Flujo de desarrollo**: estructura de carpetas, ciclo de una petición y scripts npm.
3. **PostgreSQL y Prisma**: levantar la base de datos, migraciones, seed y reinicio local.
4. **Uso de la API**: endpoints, filtros, paginación, códigos HTTP y ejemplos con `curl`.
5. **Autenticación y roles**: registro, login, Bearer tokens, expiración y permisos.
6. **Pruebas**: unitarias, integración, base de datos de test y cobertura.
7. **Docker y producción**: build, configuración, healthchecks, logs y migraciones.
8. **Seguridad y mantenimiento**: secretos, CORS, rate limiting, backups y dependencias.
9. **Ejercicios por módulo**: tareas de práctica, criterios de terminado y extensiones.

## 6. Verificación global

Cada módulo se validará con pruebas enfocadas y typecheck. Antes de considerar el proyecto terminado se ejecutará:

```bash
npm run typecheck
npm test
npm run test:coverage
npm run build
docker compose config
```

También se probará el flujo completo:

1. Levantar PostgreSQL con Docker.
2. Ejecutar migraciones y seed.
3. Autenticarse.
4. Consultar productos.
5. Crear un movimiento autorizado.
6. Confirmar el stock resultante.
7. Revisar la documentación Swagger.

## 7. Fuera de alcance inicial

El proyecto base no incluirá inicialmente:

- Frontend.
- Pagos.
- Microservicios.
- Integraciones externas con proveedores.
- Despliegue en un proveedor cloud concreto.
- Gestión completa de compras y órdenes de compra.

Estas funcionalidades pueden añadirse como extensiones después de completar la API principal.
