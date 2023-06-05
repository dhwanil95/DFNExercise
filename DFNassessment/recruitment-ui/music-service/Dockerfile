FROM node:latest

WORKDIR /usr/src/app

COPY ./db.json .

RUN npm install -g json-server@0.12.2

CMD ["json-server", "/usr/src/app/db.json", "--p", "80"]