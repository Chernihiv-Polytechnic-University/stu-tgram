FROM node:14

WORKDIR /usr/component/app
RUN npm i -g typescript
COPY /components/telegram-back/*.json ./
RUN npm i

WORKDIR /usr
COPY /libs ./libs
COPY /overlord ./overlord

WORKDIR /usr/component/app
RUN npm run compile-libs

COPY /components/telegram-back/src ./src
COPY /components/telegram-back/config ./config
RUN npm run compile-component

CMD ["node", "dist/main.js"]
