#!/bin/bash
set -e

echo "create .env file"
echo "SLACK_TOKEN=${SLACK_TOKEN}" &> .env
echo ".env created"
