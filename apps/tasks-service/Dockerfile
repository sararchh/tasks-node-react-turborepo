FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY apps/tasks-service/package*.json ./apps/tasks-service/
WORKDIR /app/apps/tasks-service
RUN npm install

WORKDIR /app
COPY . .

EXPOSE 3003

WORKDIR /app/apps/tasks-service
CMD ["npm", "run", "dev"]

