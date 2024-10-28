# Step 1: Build the application
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN yarn build

RUN yarn export
# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start"]
