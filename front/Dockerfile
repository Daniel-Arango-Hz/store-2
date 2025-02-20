# Etapa 1: Construcción de Angular
FROM node:18-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Genera la compilación de producción
RUN npm run build -- --configuration=production

# Etapa 2: Imagen final para producción
FROM node:18-alpine AS production
RUN npm install -g serve

WORKDIR /app
# Copia solo la carpeta 'browser' que contiene la aplicación Angular
COPY --from=build /app/dist/store/browser /app/browser

# Expone el puerto
EXPOSE 4200

# Corre el servidor en el puerto correcto
CMD ["sh", "-c", "serve -s /app/browser -l ${PORT:-4200}"]
