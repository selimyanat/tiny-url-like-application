# 🛠 Prerequisites

* Node v18.18+
* Docker v27+
* Yarn or Npm

# 🔨 Build & Test

You can build and test the application manually by following the instructions below, or refer to the CI pipeline defined 
in `.github/workflows/ci.yaml` for automated testing.

## WebApp

```bash
cd webapp
cp .env-dev .env
yarn install
yarn test
```

## API server
* CD to the `api` directory
* Open a terminal and run the following command to install dependencies:
```bash
cd api
cp .env-dev .env
yarn install
yarn test
```

# 🚀 Running the App

## Option 1: Run Everything via Docker Compose
The fastest way to launch the entire stack (API, WebApp, Redis, DynamoDB, RedisInsight) is with Docker Compose.
```bash
docker compose -f docker-compose.yml up -d --build
```
This builds and starts all services defined in the docker-compose.yml.

## Option 2: Run Infrastructure with Docker + App Locally from Your IDE or Terminal

### Step 1: Start Infrastructure Only

```bash
docker compose up -d redis redisinsight dynamodb dynamodb-init
```
ℹ️ Optional: Use In-Memory Mode for Fast Testing
You can run the API server in in-memory mode (without Redis or DynamoDB) by setting the following environment variable 
in your .env file:
```
USE_PERSISTENT_STORAGE=false
```
### Step 2: Run WebApp Locally
```bash
cd webapp
cp .env-dev .env
yarn start:dev
```
### Step 3: Run API Server Locally
```bash
cd api
cp .env-dev .env
yarn start:dev
```