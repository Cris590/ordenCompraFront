# Etapa de construcción
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Instalar tzdata para manejar zonas horarias
ARG APP_ENV

# Configurar la zona horaria a America/Bogota (Colombia)


# Copiar el código fuente y construir la aplicación
COPY . .
RUN npm install env-cmd --save-dev

RUN npm run build:${APP_ENV}

# Etapa de despliegue usando Nginx
FROM nginx:1.17.1-alpine

# Instalar tzdata para manejar zonas horarias
RUN apk add --no-cache tzdata

# Configurar la zona horaria a America/Bogota (Colombia)
ENV TZ=America/Bogota

# Copiar la carpeta build generada en la etapa de construcción
COPY --from=build /usr/src/app/build/ /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80, según tu configuración de Nginx
EXPOSE 80
