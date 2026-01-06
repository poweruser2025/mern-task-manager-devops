

# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Accept API URL during build time
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build Vite app (API URL gets baked here)
RUN npm run build

# ---------- Stage 2: Serve ----------
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our nginx config (already in your repo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
