FROM node:14

WORKDIR /usr/component/app
RUN npm i -g typescript
COPY /components/admin-back/*.json ./
RUN npm i

WORKDIR /usr
COPY /libs ./libs
COPY /overlord ./overlord

WORKDIR /usr/component/app
RUN npm run compile-libs

COPY /components/admin-back/src ./src
COPY /components/admin-back/config ./config
RUN npm run compile-component

CMD ["node", "dist/index.js"]
