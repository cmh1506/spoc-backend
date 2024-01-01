FROM node:alpine

LABEL author="Claus Heinrich"

WORKDIR /var/www/node-service

COPY package.json package.json
RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]