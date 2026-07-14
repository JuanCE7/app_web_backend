# TestCaseCraft — Backend

API REST (NestJS + Prisma + PostgreSQL) del proyecto de titulación **TestCaseCraft**:
genera casos de prueba funcionales a partir de casos de uso usando IA (Cohere).

## Stack

- **NestJS 10** (TypeScript), Express
- **Prisma 5** + **PostgreSQL**
- Autenticación **JWT** (`@nestjs/jwt`) con guards por ruta
- **Cohere** (`command-r`) para la generación de casos de prueba
- **Nodemailer** (Gmail) para OTP de recuperación
- **Swagger** en `/api`

## Puesta en marcha

```bash
npm install
cp .env.example .env      # completar variables (ver .env.example)
npx prisma generate
npx prisma migrate deploy  # o migrate dev en local
npm run start:dev          # http://localhost:4000/api
```

### Base de datos local (opcional)

```bash
docker compose up -d       # Postgres en localhost:5433 (ver docker-compose.yml)
```

## Salud y confiabilidad

- `GET /api/health` — liveness (no toca BD).
- `GET /api/health/db` — readiness (SELECT 1; mantiene la BD activa).

El backend corre en **Render (free)** y se duerme por inactividad. Ver
[RELIABILITY.md](./RELIABILITY.md) para el keep-alive y la UX de "servidor despertando".

## Seguridad

Las rutas de `projects`, `usecases`, `testcases`, `users` y `explanation` requieren
`Authorization: Bearer <token>`. El token se obtiene en `POST /api/auth/login`.
La recuperación de contraseña usa un token OTP firmado (`/api/auth/verifyOtp` y
`/api/auth/resetPassword`).

## Scripts útiles

| Script | Descripción |
| --- | --- |
| `npm run start:dev` | Desarrollo con watch |
| `npm run build` | Compila a `dist/` |
| `npm run start:migrate:prod` | Migra y arranca (producción) |
| `npm test` | Tests unitarios (Jest) |
