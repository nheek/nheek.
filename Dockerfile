FROM node:21-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    pkgconfig \
    pixman-dev \
    cairo-dev \
    pango-dev \
    libjpeg-turbo-dev \
    giflib-dev
RUN npm install --only=production
RUN npm install canvas@latest
COPY . .
RUN npm run build

FROM node:21-alpine AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app .
CMD ["npm", "run", "start-app"]
