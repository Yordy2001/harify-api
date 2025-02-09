# Usa una imagen base de Node.js
FROM node:22

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package*.json ./

# Instala las dependencias
RUN yarn install

# Copia el código fuente
COPY . .

RUN chmod -R 755 /app && chown -R node:node /app

# Compila la aplicación
RUN yarn run build

# Expone el puerto 3000
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["yarn", "run", "start"]