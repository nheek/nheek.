# Stage 1: Build Stage
FROM node:21-alpine AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
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
# Install canvas and its dependencies
RUN npm install canvas@latest

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Production Stage
FROM node:21-alpine AS production

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy built assets from the build stage
COPY --from=build /usr/src/app .

# Start MySQL server and wait for it to be ready, then run the app
CMD ["npm", "run", "start-app"]
