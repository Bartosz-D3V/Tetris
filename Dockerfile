FROM nginx:alpine
WORKDIR /usr/src/tetris

COPY . /usr/src/tetris/
COPY default.conf /etc/nginx/conf.d/default.conf
RUN npm i
RUN npm run prod
COPY dist/ /usr/share/nginx/html/

EXPOSE 8080