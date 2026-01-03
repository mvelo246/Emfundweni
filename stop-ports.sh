#!/bin/bash
# Script to stop processes running on ports 3000 and 3001

echo "Stopping processes on ports 3000 and 3001..."

# Kill process on port 3001 (backend)
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "Stopping process on port 3001..."
    lsof -ti:3001 | xargs kill -9
    echo "✓ Port 3001 is now free"
else
    echo "✓ Port 3001 is already free"
fi

# Kill process on port 3000 (frontend)
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "Stopping process on port 3000..."
    lsof -ti:3000 | xargs kill -9
    echo "✓ Port 3000 is now free"
else
    echo "✓ Port 3000 is already free"
fi

echo ""
echo "All ports are now free. You can run 'npm run dev' now."

