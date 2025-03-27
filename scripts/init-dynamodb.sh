#!/bin/bash
set -e

echo "Waiting for DynamoDB to start..."
until curl -s http://dynamodb:8000; do
  sleep 1
done

TABLE_NAME="shortUrls"
ENDPOINT_URL="http://dynamodb:8000"
REGION="local"

echo "Checking if '$TABLE_NAME' table exists..."

EXISTING_TABLE=$(aws dynamodb list-tables \
  --endpoint-url "$ENDPOINT_URL" \
  --region "$REGION" \
  --output text \
  --query "TableNames[?contains(@, '$TABLE_NAME')]")

if [[ "$EXISTING_TABLE" == "$TABLE_NAME" ]]; then
  echo "Table '$TABLE_NAME' already exists. Skipping creation."
else
  echo "Creating '$TABLE_NAME' table..."
  aws dynamodb create-table \
    --table-name "$TABLE_NAME" \
    --attribute-definitions AttributeName=shortId,AttributeType=S \
    --key-schema AttributeName=shortId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url "$ENDPOINT_URL" \
    --region "$REGION"

  echo "Table '$TABLE_NAME' created successfully."
fi
