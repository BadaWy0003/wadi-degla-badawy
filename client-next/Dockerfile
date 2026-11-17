# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Receive API URL as build arg so NEXT_PUBLIC_ vars are baked in at build time
ARG NEXT_PUBLIC_BASE_API_URL
ENV NEXT_PUBLIC_BASE_API_URL=$NEXT_PUBLIC_BASE_API_URL
# "staging" on the staging app (noindex, no analytics); empty for production.
ARG NEXT_PUBLIC_SITE_ENV=""
ENV NEXT_PUBLIC_SITE_ENV=$NEXT_PUBLIC_SITE_ENV
# A new value on every deploy (set by the workflow), so the build below always runs again
# and fetches the latest content from the API, even when the code hasn't changed.
ARG PUBLISH_ID=""
RUN echo "publish $PUBLISH_ID"

RUN npm run build

# ---- Serve stage ----
FROM nginx:1.25-alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files (Next.js static export goes to /out)
COPY --from=builder /app/out /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
