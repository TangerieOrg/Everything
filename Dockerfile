FROM node:18.3.0 as build

ARG OPENAI_KEY
ENV OPENAI_KEY=$OPENAI_KEY
ENV BASE_URL=/everything

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

EXPOSE 80

ENTRYPOINT ["npm", "start"]