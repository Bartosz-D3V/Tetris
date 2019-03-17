FROM nginx:alpine
WORKDIR /usr/src/tetris

COPY . /usr/src/tetris/
RUN apk add --update nodejs-npm
RUN npm i
RUN npm run prod
COPY dist/ /usr/share/nginx/html/
