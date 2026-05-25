FROM node:22-slim AS builder

WORKDIR /app

COPY web/package.json web/package-lock.json ./web/
RUN cd web && npm ci

COPY web/public/ ./web/public/
COPY web/src/ ./web/src/
COPY web/index.html web/vite.config.js web/eslint.config.js ./web/

RUN cd web && npm run build

FROM nginx:alpine

COPY --from=builder /app/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
