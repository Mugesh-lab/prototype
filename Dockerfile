FROM node:18-alpine AS build
WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source and build frontend
COPY . .
RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --only=production --silent

# Copy built frontend and server
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/src ./src

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000
CMD ["node", "server/index.js"]
