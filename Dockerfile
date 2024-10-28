# Step 1: Build the application
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

RUN npm run export
# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
