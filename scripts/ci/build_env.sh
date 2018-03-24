#!/bin/bash
set -e

echo "create .env file"
echo "SLACK_TOKEN=${SLACK_TOKEN}\NODE_ENV=production\SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL}" &> .env
echo ".env created"
