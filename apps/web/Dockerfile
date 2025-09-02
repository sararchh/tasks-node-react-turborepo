FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "dev", "--host", "0.0.0.0"]

FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN yarn install --production

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "preview", "--host", "0.0.0.0"]
