FROM node:20 AS base
WORKDIR /zzan

COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean

COPY . .

FROM base AS builder
RUN yarn build

EXPOSE 3000

FROM builder AS development
CMD ["yarn", "start:dev"]

FROM builder AS production
CMD ["yarn", "start"]