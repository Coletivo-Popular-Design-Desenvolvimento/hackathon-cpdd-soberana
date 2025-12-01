FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copia o resto
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]