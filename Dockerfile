# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining files
COPY . .

# Build the project
RUN npm run build

# Create upload directory
RUN mkdir -p uploads

# Set port
EXPOSE 3000 5000

# Run the application
CMD ["node", "server.js"]