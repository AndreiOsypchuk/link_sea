FROM node:16-alpine as builder

WORKDIR /app
COPY package-lock.json /app/package-lock.json
COPY package.json /app/package.json
RUN npm install
COPY . /app

EXPOSE 4999
ENV PORT 4999
CMD ["npm", "run", "dev"]

