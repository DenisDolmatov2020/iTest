# Dockerfile для сервера
FROM node:18

# Создайте директорию приложения
WORKDIR /usr/src/app

# Установите зависимости приложения
COPY package*.json ./
RUN npm install

# Скопируйте исходный код приложения
COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]
