# Use official Node.js LTS image
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package.json (no dependencies, but best practice)
COPY package.json ./

# Copy app source
COPY index.js ./

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
