FROM node:16-alpine as builder

WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
COPY . /app
CMD ["npm", "run", "dev"]