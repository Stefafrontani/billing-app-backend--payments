FROM node:alpine
WORKDIR /payments
COPY package.json .
RUN npm install
COPY . .
ENV NODE_ENV=development
CMD ["npm", "start"]