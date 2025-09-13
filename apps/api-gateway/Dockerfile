FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY apps/api-gateway/package*.json ./apps/api-gateway/
WORKDIR /app/apps/api-gateway
RUN npm install

WORKDIR /app
COPY . .

EXPOSE 3001

WORKDIR /app/apps/api-gateway
CMD ["npm", "run", "dev"]

