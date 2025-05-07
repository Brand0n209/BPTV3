# Use official Node.js LTS image
FROM node:18-slim

WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
