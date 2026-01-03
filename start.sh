#!/bin/bash

# Start Backend Server
echo "Starting Backend Server..."
cd backend && node server.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start Frontend Server
echo "Starting Frontend Server..."
cd ../frontend && npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Wait for user interrupt
wait

