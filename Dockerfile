# Stage 1: Build Stage
FROM node:21-alpine AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Production Stage
FROM node:21-alpine AS production

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install MySQL client
RUN apk --no-cache add mysql-client

# Install bash and wait-for-it script
RUN apk --no-cache add bash \
    && wget -O /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x /usr/local/bin/wait-for-it.sh

# Copy built assets from the build stage
COPY --from=build /usr/src/app .

RUN ls -al

# Start MySQL server and wait for it to be ready, then run the app
CMD ["sh", "-c", "mysqld_safe --user=mysql & /usr/local/bin/wait-for-it.sh mysql-db:3306 -- npm run start-app"]
