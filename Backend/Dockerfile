FROM node:20
RUN apt-get update && apt-get install -y python3
RUN apt-get update && apt-get install -y iputils-ping

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "start"]