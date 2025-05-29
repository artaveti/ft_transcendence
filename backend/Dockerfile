FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY . .

# Install sqlite and dependencies
RUN apk add --no-cache sqlite

# Install Node.js dependencies
RUN npm install

# Install pip for Python
RUN apk add --no-cache py3-pip

# Install sqlite-web
RUN pip install sqlite-web --break-system-packages

# Copy the rest of your application code

# Expose the Fastify port
EXPOSE 8585

# Optional: expose a dev/debugging port
EXPOSE 5555

# Start the application
CMD ["npm", "start"]
