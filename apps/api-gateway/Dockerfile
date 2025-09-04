FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3001

CMD ["yarn", "start:dev"]

FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN yarn install --production

COPY . .

RUN yarn build

EXPOSE 3001

CMD ["yarn", "start:prod"]