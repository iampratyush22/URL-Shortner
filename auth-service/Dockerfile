# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first (cache friendly)
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

# Copy source code
COPY src ./src

# Build
RUN npm run build


# ---------- Runtime stage ----------
FROM node:20-alpine

WORKDIR /app

# Copy only what is needed
COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/build ./build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "build/server.js"]
