# Build stage
FROM node:20 AS builder
WORKDIR /app

# Install Chromium and Puppeteer dependencies for react-snap
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libasound2 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    libxcb-dri3-0 \
    libgbm1 \
    libglib2.0-0 \
    libcups2 \
    && rm -rf /var/lib/apt/lists/*

# Configure Puppeteer to use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy package files and install dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of your application
COPY . .

# Set environment variables for react-snap and build
ENV REACT_APP_BASE_API_URL="https://server-withered-wildflower-1595.fly.dev" \
    NODE_ENV=production \
    REACT_SNAP_TIMEOUT=60000

# Build the application with react-snap
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]