FROM mhart/alpine-node:14.15.3

RUN mkdir /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
COPY .env /app

RUN node -v
RUN yarn install
