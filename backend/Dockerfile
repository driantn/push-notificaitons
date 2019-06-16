FROM node:10.15.3-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache --virtual .gyp git python make g++ \
    && npm install \
    && apk del .gyp git

COPY . .

EXPOSE 3000

CMD ["npm", "run", "server"]