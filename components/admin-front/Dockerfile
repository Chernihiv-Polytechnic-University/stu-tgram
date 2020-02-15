FROM node:12.14 as build

WORKDIR /app

COPY . ./

ENV REACT_APP_API_URL=http://localhost:3000/api/v1

RUN npm run compile-doc


FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
