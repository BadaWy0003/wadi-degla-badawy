# Build stage
FROM node:20 as builder
WORKDIR /app

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxext6 \
    libxrandr2 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxfixes3 \
    libxi6 \
    libxrender1 \
    libxtst6 \
    libxss1 \
    libglib2.0-0 \
    libnss3 \
    libcups2 \
    libxcb-dri3-0 \
    libdrm2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables BEFORE the build
ENV REACT_APP_BASE_API_URL="https://server-withered-wildflower-1595.fly.dev"

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]