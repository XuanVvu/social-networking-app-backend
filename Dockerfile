FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7777

CMD ["npm", "run", "start:dev"]

