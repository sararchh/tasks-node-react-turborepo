FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY apps/auth-service/package*.json ./apps/auth-service/
WORKDIR /app/apps/auth-service
RUN npm install

WORKDIR /app
COPY . .

EXPOSE 3002

WORKDIR /app/apps/auth-service
CMD ["npm", "run", "dev"]


