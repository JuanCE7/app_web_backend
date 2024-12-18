# Usar una versión estable y pequeña de Node.js
FROM node:20.11.1-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev

# Copiar archivos del proyecto y construir la aplicación
COPY . ./
RUN npm run build

# Generar el cliente de Prisma
RUN npx prisma generate

# --- Imagen final optimizada ---
FROM node:20.11.1-alpine AS production

WORKDIR /app

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Configurar la variable de entorno de producción
ENV NODE_ENV=production

# Exponer el puerto que usa la API
EXPOSE 4000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]
