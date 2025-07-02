FROM node:24

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npx prisma migrate deploy || true

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
