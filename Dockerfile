FROM node:14-alpine
WORKDIR /app
COPY ./package.json ./package-lock.json bower.json .bowerrc gulpfile.js ./
RUN apk --no-cache add git
RUN npm run install-dependencies
RUN mkdir -p /app/src
COPY src/ ./src
RUN npm run build-client
EXPOSE 3000
CMD [ "node", "src/index.js" ]