# syntax=docker/dockerfile:1

FROM node:lts-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:lts-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Nur das Nötige aus dem Build übernehmen
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]