# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Accept build arguments for Astro PUBLIC_ variables
ARG PUBLIC_API_URL
ARG PUBLIC_SITE_ORIGIN
ARG PUBLIC_DISCORD_CLIENT_ID

# Set them as environment variables for the build process
ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_SITE_ORIGIN=$PUBLIC_SITE_ORIGIN
ENV PUBLIC_DISCORD_CLIENT_ID=$PUBLIC_DISCORD_CLIENT_ID

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the project (Astro will inject PUBLIC_ variables into the client bundle here)
RUN npm run build

# Runtime Stage
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy built files and package files
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json

# Install only production dependencies
RUN npm install --omit=dev

# Expose the port (Astro default is 4321, but we use 3000 here)
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Start the server
CMD ["node", "./dist/server/entry.mjs"]
