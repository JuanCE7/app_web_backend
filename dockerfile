# Usar una versión estable de Node.js (no Alpine)
FROM node:20.11.1 AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias, incluyendo @nestjs/cli como dependencia de desarrollo
RUN npm install --include=dev

# Copiar archivos del proyecto y construir la aplicación
COPY . ./
RUN npm run build

# Generar el cliente de Prisma
RUN npx prisma generate

# --- Imagen final optimizada ---
FROM node:20.11.1 AS production

WORKDIR /app

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/utils/templates ./src/utils/templates

# Configurar la variable de entorno de producción
ENV NODE_ENV=production

# Exponer el puerto que usa la API
EXPOSE 4000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]