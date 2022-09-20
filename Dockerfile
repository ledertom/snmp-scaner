FROM node
WORKDIR /var/ui

COPY src ./
COPY package.json ./
COPY tsconfig.json ./

RUN npm install
RUN npx tsc

RUN rm -rf src tsconfig.json

ENTRYPOINT ["node", "build/index.js"]