FROM node:latest

RUN mkdir /app
WORKDIR /app
COPY package.json /app/
