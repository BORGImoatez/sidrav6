# Étape 1 : build Angular
FROM node:20.13.1-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Étape 2 : servir avec NGINX
FROM nginx:1.25-alpine
COPY --from=build /app/dist/sidra /usr/share/nginx/html

# Configuration custom de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
