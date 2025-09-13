FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY apps/notifications-service/package*.json ./apps/notifications-service/
WORKDIR /app/apps/notifications-service
RUN npm install

WORKDIR /app
COPY . .

EXPOSE 3004

WORKDIR /app/apps/notifications-service
CMD ["sh", "-c", "npm run migration:run && npm run dev"]
