#!/bin/bash

# Stock API Deployment Script for Google Cloud VM

set -e

echo "🚀 Deploying Stock GPT to Google Cloud VM"

# Variables
VM_IP="34.123.8.135"  # Replace with your VM IP
PROJECT_DIR="stockgpt"
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Copy files to VM
echo "📦 Copying files to VM..."
rsync -avz -e "ssh -o StrictHostKeyChecking=no" \
    --exclude='.git' \
    --exclude='__pycache__' \
    --exclude='.env' \
    ./ $VM_IP:~/$PROJECT_DIR/

# Create .env file on remote if it doesn't exist
echo "🔧 Setting up environment..."
ssh $VM_IP << EOF
    cd ~/$PROJECT_DIR
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "Created .env file from example"
    fi
EOF

# Deploy on VM
echo "🐳 Deploying with Docker Compose..."
ssh $VM_IP << EOF
    cd ~/$PROJECT_DIR
    echo "Stopping existing containers..."
    docker-compose down || true
    
    echo "Building and starting new containers..."
    docker-compose up -d --build
    
    echo "Checking service status..."
    docker-compose ps
    docker-compose logs -f --tail=20
EOF

echo "✅ Deployment completed!"
echo "🌐 API should be available at: http://$VM_IP:8000"
echo "📚 API docs at: http://$VM_IP:8000/docs"