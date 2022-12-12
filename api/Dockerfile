FROM node:16-alpine as builder

WORKDIR /app
COPY package-lock.json /app/package-lock.json
COPY package.json /app/package.json
RUN npm install
COPY . /app

#EXPOSE 4000
ENV PORT 4000
CMD ["npm", "run", "dev"]

