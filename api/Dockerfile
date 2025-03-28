# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy only what is needed for production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

RUN yarn install --production --frozen-lockfile

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
CMD ["node", "dist/main"]
