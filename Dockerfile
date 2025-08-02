# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build assets (optional, can be omitted if only dev server is needed)
RUN npm run build || true

# Load environment variables
ENV PORT=8080

# Expose port from environment variable
ARG PORT
EXPOSE ${PORT}

# Start the development server
CMD ["npm", "run", "start"]
