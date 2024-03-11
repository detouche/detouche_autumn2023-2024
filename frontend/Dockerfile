FROM node:18.13.0-alpine
WORKDIR /app
COPY ./package.json .
RUN yarn add
COPY . .
CMD [ "yarn", "build" ]