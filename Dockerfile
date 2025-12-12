# Use Node.js 18 on Alpine Linux (lightweight and stable)
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker caching for dependencies
COPY package*.json ./

# Install dependencies (this will use the fixed versions from your package.json)
RUN npm install

# Copy the rest of your project files (contracts, tests, config)
COPY . .

# Compile the contracts so they are ready to go
RUN npx hardhat compile

# The default command: Run the test suite when the container starts
CMD ["npx", "hardhat", "test"]