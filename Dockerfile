FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV API_KEY=""

CMD ["node", "build/index.js"] 