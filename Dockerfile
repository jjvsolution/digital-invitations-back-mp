# -------- STAGE 1: Builder --------
FROM node:22 AS builder

WORKDIR /app

# Copiar todo primero (más simple y seguro)
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

RUN npm install --legacy-peer-deps

# Generar cliente Prisma
RUN npx prisma generate

# Compilar Nest
RUN npm run build

# Copiar el resto del código fuente
COPY . .

# -------- STAGE 2: Production --------
FROM node:22-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY package*.json ./

EXPOSE 3000

CMD ["node", "dist/src/main"]