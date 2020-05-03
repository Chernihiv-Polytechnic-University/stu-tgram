FROM node:14 as build

WORKDIR /usr/component/app
RUN npm i -g typescript
COPY /components/admin-front/*.json ./
RUN npm i

WORKDIR /usr
COPY /libs ./libs
COPY /overlord ./overlord

WORKDIR /usr/component/app
RUN npm run compile-libs

COPY /components/admin-front/src ./src
COPY /components/admin-front/public ./public
COPY /components/admin-front/.env ./.env
RUN npm run build

FROM nginx:alpine

COPY /components/admin-front/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/component/app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
