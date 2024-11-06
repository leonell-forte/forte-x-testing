#Step 1: Build the application
FROM node:18

# Set the working directory
WORKDIR /app

RUN apt-get update && \
    apt-get install -y jq

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm i --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Next.js application with static export
RUN npm run build

# Ensure entrypoint script is executable
RUN chmod +x ./entrypoint.sh

# Expose port
EXPOSE 3000

# Define the entrypoint for the container
ENTRYPOINT ["./entrypoint.sh"]