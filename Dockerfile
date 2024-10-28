# Step 1: Build the application
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Step 2: Serve the application
FROM node:18 AS runner

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Install only production dependencies
RUN npm install --production

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
