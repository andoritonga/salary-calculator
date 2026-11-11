# Stage 1: Build Vite React App
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with Non-Root Nginx Unprivileged Alpine
FROM nginxinc/nginx-unprivileged:1.27-alpine

USER root
RUN rm -rf /usr/share/nginx/html/* && mkdir -p /etc/nginx/snippets

# Copy built assets from builder
COPY --from=build --chown=101:101 /app/dist /usr/share/nginx/html

# Copy custom nginx configuration and shared security headers
COPY --chown=101:101 security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --chown=101:101 nginx.conf /etc/nginx/conf.d/default.conf

USER 101

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
