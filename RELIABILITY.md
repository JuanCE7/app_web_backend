# Confiabilidad en tier gratuito (servidor "dormido")

El backend corre en **Render (free)**, que **duerme** el servicio tras ~15 min de
inactividad; despertar tarda 30–60s (arranque en frío). La BD gratuita (Supabase/Neon)
también puede pausarse por inactividad. Esta es la estrategia para manejarlo sin costo.

## 1. Endpoints de salud

- `GET /api/health` → liveness ligero (no toca BD). Lo usa el frontend para detectar
  si el servidor está despierto y el keep-alive básico.
- `GET /api/health/db` → readiness: hace `SELECT 1`. Además "toca" la BD, evitando que
  se pause. **El keep-alive debe apuntar aquí** para mantener despiertos backend + BD.

## 2. UX de espera (frontend)

- `src/lib/apiClient.ts`: todas las llamadas pasan por `apiFetch`/`apiJson`, con
  **timeout**, **reintentos con backoff** (cubre el cold start) y **errores normalizados**.
- `src/context/BackendStatusProvider.tsx`: muestra un **aviso global** "Estamos
  despertando el servidor…" con barra de progreso y **botón Reintentar** cuando el
  backend está iniciándose o caído.
- La página de login hace un **ping de pre-calentamiento** al cargar, para que el
  servidor ya esté despierto al momento de iniciar sesión.

## 3. Keep-alive (para que rara vez duerma)

### Opción A — GitHub Actions (incluida)
`.github/workflows/keep-alive.yml` hace ping a `/api/health/db` cada ~10 min.

Configurar el secret en el repo del backend:
`Settings → Secrets and variables → Actions → New repository secret`
- `HEALTH_URL = https://TU-BACKEND.onrender.com/api/health/db`

Puede ejecutarse manualmente desde la pestaña **Actions → keep-alive → Run workflow**.
Nota: el scheduler de GitHub puede retrasarse algunos minutos.

### Opción B — UptimeRobot / cron-job.org (recomendada como refuerzo)
Monitor HTTP(s) gratuito apuntando a `https://TU-BACKEND.onrender.com/api/health`
cada 5 min. Ventaja: intervalo más fiable y **alertas por email** si el backend se cae.

> Consumo: Render free ofrece ~750 horas/mes, suficiente para un servicio despierto
> todo el mes. Mantenerlo activo con el keep-alive **no genera costo**.
