FROM node:10-alpine AS base 
RUN apk add --no-cache git python make g++ 
WORKDIR /app 
COPY package.json . 
FROM base AS dependencies 
RUN npm set progress=false && npm config set depth 0 
RUN npm install --only=production 
RUN cp -R node_modules prod_node_modules 
RUN npm install 
FROM dependencies AS test 
COPY .. 
# RUN npm run linter 
RUN npm run build 
FROM base AS release 
COPY --from=dependencies /app/prod_node_modules ./node_modules 
COPY --from=test /app/dist ./dist 
EXPOSE 3000 
CMD [ "npm", "start" ]