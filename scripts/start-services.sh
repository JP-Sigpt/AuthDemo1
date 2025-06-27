#!/bin/bash

# Start services for testing
echo "Starting services for testing..."

# Start server in background
echo "Starting server..."
cd server
npm run dev &
SERVER_PID=$!
cd ..

# Wait for server to start
echo "Waiting for server to start..."
sleep 10
curl -f http://localhost:7001/test || echo "Server not ready yet"

# Start client in background
echo "Starting client..."
cd client
npm run dev &
CLIENT_PID=$!
cd ..

# Wait for client to start
echo "Waiting for client to start..."
sleep 15
curl -f http://localhost:3001 || echo "Client not ready yet"

# Wait for services to be ready
echo "Waiting for services to be ready..."
timeout 60 bash -c 'until curl -f http://localhost:7001/test; do sleep 2; done'
timeout 60 bash -c 'until curl -f http://localhost:3001; do sleep 2; done'
echo "Services are ready!"

# Function to cleanup on exit
cleanup() {
    echo "Stopping services..."
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

echo "Services started. Press Ctrl+C to stop."
echo "Server: http://localhost:7001"
echo "Client: http://localhost:3001"

# Keep script running
wait 