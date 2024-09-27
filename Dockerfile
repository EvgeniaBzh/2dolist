# Використовуємо Node.js як базовий образ
FROM node:16

# Створюємо директорію для додатку
WORKDIR /app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо всі файли проєкту в контейнер
COPY . .

# Відкриваємо порт 8080 для з'єднань
EXPOSE 8080

# Запускаємо сервер
CMD ["npm", "start"]
