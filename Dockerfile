FROM node
WORKDIR /var/ui
COPY src ./
COPY package.json ./
COPY tsconfig.json ./
RUN npm install
RUN npx tsc
ENTRYPOINT ["node", "build/index.js"]