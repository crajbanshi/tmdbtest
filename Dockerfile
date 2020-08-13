FROM node:12
WORKDIR /src
COPY package.json /src
RUN npm install
COPY . /src
EXPOSE 3200
CMD npm start
