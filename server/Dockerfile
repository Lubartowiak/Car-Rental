FROM node:20.12.2-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:20.12.2-alpine
WORKDIR /app
COPY package*.json .env ./
RUN npm install --omit=dev
COPY --from=base /app/dist ./dist
EXPOSE 3000
CMD node ./dist/app.js