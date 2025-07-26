FROM node:20-alpine

WORKDIR /app

COPY package*.json .
#copy package files first. (Cache Optimization)

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
