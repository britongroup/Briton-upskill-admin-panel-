# Step 1: Build the React application
FROM node:16-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Build the React application
RUN npm run build

# Step 2: Serve the built React app using Node.js
FROM node:16-alpine

WORKDIR /app

# Copy the built React app from the previous stage
COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["npx", "http-server", "./build", "-p", "3000"]


# Step 1: Build the React application
#FROM node:16-alpine as build

#WORKDIR /app

#COPY package.json ./

#RUN yarn install --frozen-lockfile

#COPY . .

#RUN yarn build

# Step 2: Serve the built React app using Node.js
#FROM node:16-alpine

#WORKDIR /app

#COPY --from=build /app/build ./build

#EXPOSE 3000

#CMD ["npx", "http-server", "./build", "-p", "3000"]
