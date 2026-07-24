# PostgreSQL local

## Iniciar

Desde la raíz del proyecto:

```bash
npm run db:up
```

El servicio expone PostgreSQL en `localhost:5432` por defecto.

## Comprobar el estado

```bash
docker compose -f docker/docker-compose.yml ps
```

El contenedor debe mostrar el estado `healthy`.

## Ver logs

```bash
npm run db:logs
```

## Detener

```bash
npm run db:down
```

`npm run db:down` detiene los contenedores, pero conserva el volumen `postgres-data`.

Para borrar también los datos locales de desarrollo:

```bash
docker compose -f docker/docker-compose.yml down -v
```

No uses `down -v` si necesitas conservar la base de datos local.
