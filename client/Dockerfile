FROM node:20.12.2-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:1.21.1
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=base /app/build .
EXPOSE 80
CMD nginx -g 'daemon off;'
