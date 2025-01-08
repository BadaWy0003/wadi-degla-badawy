# Build stage
FROM node:20-alpine as builder 
WORKDIR /app

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